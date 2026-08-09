class DomainError(Exception):
    """Base class for expected business-rule failures."""


class EmailAlreadyRegisteredError(DomainError):
    """Raised when a registration would duplicate an email address."""


class InvalidCredentialsError(DomainError):
    """Raised when authentication cannot establish a valid user identity."""


class ResourceNotFoundError(DomainError):
    """Raised when a requested domain resource does not exist."""


class ResourceConflictError(DomainError):
    """Raised when a uniqueness rule prevents a resource change."""
