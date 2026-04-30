import uuid
import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pythonjsonlogger import jsonlogger
import logging

# Configure structured JSON logger
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    '%(asctime)s %(levelname)s %(name)s %(message)s %(correlation_id)s'
)
logHandler.setFormatter(formatter)
logger = logging.getLogger('demo-api')
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

app = FastAPI(
    title="Wallace Mugo - Observability Demo API",
    description="Live demo showing structured logging, correlation IDs, and request tracing",
    version="1.0.0"
)

# Enable CORS for your portfolio site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.100.42:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for correlation ID
@app.middleware("http")
async def add_correlation_id(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
    request.state.correlation_id = correlation_id
    
    # Add to response headers
    response = await call_next(request)
    response.headers["X-Correlation-ID"] = correlation_id
    
    # Structured log entry
    logger.info(
        "Request received",
        extra={
            "correlation_id": correlation_id,
            "method": request.method,
            "path": request.url.path,
            "client_ip": request.client.host if request.client else "unknown"
        }
    )
    return response

# Health endpoint
@app.get("/health")
async def health_check(request: Request):
    correlation_id = request.state.correlation_id
    logger.info(
        "Health check performed",
        extra={"correlation_id": correlation_id, "status": "ok"}
    )
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "correlation_id": correlation_id,
        "service": "observability-demo"
    }

# Trace endpoint - simulates request lifecycle
@app.get("/trace")
async def trace_request(request: Request):
    start_time = time.time()
    correlation_id = request.state.correlation_id
    
    # Simulate processing steps
    step1_time = time.time()
    logger.info(
        "Trace step 1: Validation complete",
        extra={"correlation_id": correlation_id, "duration_ms": round((step1_time - start_time) * 1000, 2)}
    )
    
    step2_time = time.time()
    logger.info(
        "Trace step 2: Business logic executed",
        extra={"correlation_id": correlation_id, "duration_ms": round((step2_time - step1_time) * 1000, 2)}
    )
    
    step3_time = time.time()
    logger.info(
        "Trace step 3: Response prepared",
        extra={"correlation_id": correlation_id, "duration_ms": round((step3_time - step2_time) * 1000, 2)}
    )
    
    total_duration = (time.time() - start_time) * 1000
    
    return {
        "message": "Request traced successfully",
        "correlation_id": correlation_id,
        "total_duration_ms": round(total_duration, 2),
        "steps": [
            {"step": "validation", "duration_ms": round((step1_time - start_time) * 1000, 2)},
            {"step": "business_logic", "duration_ms": round((step2_time - step1_time) * 1000, 2)},
            {"step": "response", "duration_ms": round((step3_time - step2_time) * 1000, 2)}
        ],
        "tip": "Use this correlation_id to trace this request in logs"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Wallace Mugo - Observability Demo API",
        "endpoints": ["/health", "/trace", "/docs"],
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
