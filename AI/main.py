from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import json
import os
from typing import Dict, List, Optional
import logging
from datetime import datetime
import uuid
from pymongo import MongoClient
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from langchain.text_splitter import RecursiveCharacterTextSplitter
try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import HuggingFacePipeline
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QueryRequest(BaseModel):
    user_query: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str
    status: str = "success"

class HealthResponse(BaseModel):
    status: str
    message: str

app = FastAPI(
    title="Gut Health Coach API",
    description="AI-powered gut health advisor API",
    version="1.0.0"
)

origins = [
    os.getenv("FRONTEND_ENDPOINT"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.getenv("MONGODB_URI")
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client["guthealth_db"]
conversations_collection = db["conversations"]

rag_system = None
sessions: Dict[str, Dict] = {}

class GutHealthRAG:
    def __init__(self, embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
        self.vectorstore = None
        self.qa_chain = None
        logger.info(f"Initialized RAG system with embedding model: {embedding_model}")

    def create_knowledge_base(self, instruction_data: List[Dict]):
        logger.info("Building vector store...")
        documents = [f"Q: {item['instruction']}\nA: {item['response']}" for item in instruction_data]
        splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=30)
        splits = splitter.create_documents(documents)
        self.vectorstore = FAISS.from_documents(splits, self.embeddings)
        logger.info(f"Stored {len(splits)} vector chunks.")

    def setup_qa_chain(self, llm):
        prompt_template = """Answer the question based on the context provided about gut health.
Context: {context}
Question: {question}
Answer:"""

        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": 3},
                search_type="similarity"
            ),
            chain_type_kwargs={"prompt": prompt},
            return_source_documents=False
        )

    def get_response(self, query: str) -> str:
        if not self.qa_chain:
            return "QA chain not initialized."

        try:
            result = self.qa_chain.run(query)

            if "Context:" in result and "Question:" in result:
                lines = result.split('\n')
                answer_started = False
                answer_lines = []

                for line in lines:
                    if line.strip().startswith("Answer:"):
                        answer_started = True
                        answer_part = line.split("Answer:", 1)
                        if len(answer_part) > 1 and answer_part[1].strip():
                            answer_lines.append(answer_part[1].strip())
                    elif answer_started and line.strip():
                        answer_lines.append(line.strip())

                if answer_lines:
                    return " ".join(answer_lines)

            return result.strip()

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return f"I apologize, but I encountered an error while processing your question. Please try rephrasing your query."

    def get_simple_response(self, query: str) -> str:
        if not self.vectorstore:
            return "Knowledge base not initialized."

        try:
            retriever = self.vectorstore.as_retriever(search_kwargs={"k": 2})
            docs = retriever.get_relevant_documents(query)

            if not docs:
                return "I couldn't find specific information about that topic in my gut health knowledge base. Please try asking about general gut health, probiotics, diet, or digestive issues."

            responses = []
            for doc in docs:
                content = doc.page_content.strip()
                if "A:" in content:
                    answer_part = content.split("A:", 1)[1].strip()
                    responses.append(answer_part)

            if responses:
                return responses[0]

            return "I found some information but couldn't format it properly. Please try rephrasing your question."

        except Exception as e:
            logger.error(f"Error in simple response: {str(e)}")
            return "I encountered an error while searching for information. Please try again."

async def initialize_rag_system():
    global rag_system

    try:
        logger.info("Initializing RAG system...")
        rag_system = GutHealthRAG()

        data_file = "cleaned_json.json"
        if os.path.exists(data_file):
            with open(data_file, 'r') as f:
                instruction_data = json.load(f)

            rag_system.create_knowledge_base(instruction_data)

            try:
                hf_pipeline = pipeline(
                    "text2text-generation",
                    model="google/flan-t5-small",
                    tokenizer="google/flan-t5-small",
                    max_new_tokens=150,
                    do_sample=True,
                    temperature=0.7,
                    device=0 if torch.cuda.is_available() else -1
                )

                llm = HuggingFacePipeline(
                    pipeline=hf_pipeline,
                    model_kwargs={"temperature": 0.7, "max_new_tokens": 100}
                )
                rag_system.setup_qa_chain(llm)
                logger.info("Full QA chain initialized successfully")

            except Exception as e:
                logger.warning(f"Could not initialize full QA chain, using simple retrieval: {e}")
        else:
            logger.error(f"Training data file {data_file} not found")

    except Exception as e:
        logger.error(f"Failed to initialize RAG system: {e}")
        rag_system = None

@app.on_event("startup")
async def startup_event():
    await initialize_rag_system()

@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="healthy",
        message="Gut Health Coach API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    global rag_system

    if rag_system is None:
        return HealthResponse(
            status="unhealthy",
            message="RAG system not initialized"
        )

    return HealthResponse(
        status="healthy",
        message="All systems operational"
    )

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    global rag_system, sessions

    if rag_system is None:
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable. RAG system not initialized."
        )

    session_id = request.session_id or str(uuid.uuid4())

    if session_id not in sessions:
        sessions[session_id] = {
            "created_at": datetime.now().isoformat(),
            "query_count": 0
        }

    sessions[session_id]["query_count"] += 1
    sessions[session_id]["last_query"] = datetime.now().isoformat()

    try:
        if hasattr(rag_system, 'qa_chain') and rag_system.qa_chain is not None:
            response = rag_system.get_response(request.user_query)
        else:
            response = rag_system.get_simple_response(request.user_query)

        if response and not response.startswith("I"):
            response = f"{response}\n\nNote: This advice is for informational purposes only. Please consult with a healthcare professional for personalized medical advice."

        conversations_collection.insert_one({
            "session_id": session_id,
            "user_query": request.user_query,
            "assistant_response": response,
            "timestamp": datetime.now().isoformat()
        })

        return QueryResponse(
            response=response,
            session_id=session_id,
            timestamp=datetime.now().isoformat(),
            status="success"
        )

    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your query. Please try again."
        )

@app.get("/session/{session_id}")
async def get_session_info(session_id: str):
    global sessions

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    return sessions[session_id]

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    global sessions

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    del sessions[session_id]
    return {"message": "Session deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
