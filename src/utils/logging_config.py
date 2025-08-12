import logging
import sys

_logging_configured = False

def setup_logging(level=logging.INFO) -> logging.Logger:
    """Configure logging for the application."""
    global _logging_configured
    if _logging_configured:
        return logging.getLogger(__name__)
    
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )
    _logging_configured = True
    return logging.getLogger(__name__)

def get_logger(name: str) -> logging.Logger:
    """Get a logger with the specified name. Auto-setup if needed."""
    if not _logging_configured:
        setup_logging()  # Auto-setup if not already done
    return logging.getLogger(name)