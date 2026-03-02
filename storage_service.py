import os
import cloudinary
import cloudinary.uploader

# Configuration
cloudinary.config(
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key = os.getenv('CLOUDINARY_API_KEY'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET'), # Click 'View API Keys' above to copy your API secret
    secure=True
)

# Upload an image
def upload_image_to_cloud(image):
    upload_result = cloudinary.uploader.upload(image)
    return upload_result["secure_url"]
