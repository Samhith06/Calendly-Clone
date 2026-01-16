from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import event_types, availability, bookings, meetings

app = FastAPI(title="Calendly Clone API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(event_types.router, prefix="/api/event-types", tags=["event-types"])
app.include_router(availability.router, prefix="/api/availability", tags=["availability"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["meetings"])

@app.get("/")
def read_root():
    return {"message": "Calendly Clone API"}
