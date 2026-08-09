from fastapi import APIRouter, status

from app.core.email import send_email
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(contact_in: ContactCreate) -> ContactResponse:
    # Send email notification to admin & user confirmation
    subject = f"Yeni İletişim Mesajı: {contact_in.full_name}"
    body = (
        f"Sayın Yetkili,\n\n"
        f"Armonitex web sitesinden yeni bir iletişim mesajı alındı:\n\n"
        f"Gönderen: {contact_in.full_name} ({contact_in.email})\n"
        f"Mesaj:\n{contact_in.message}\n\n"
        f"Saygılarımızla,\nArmonitex Web Otomasyonu"
    )
    await send_email(to_email="info@armonitex.com.tr", subject=subject, body=body)

    return ContactResponse(
        status="success",
        message="Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.",
    )
