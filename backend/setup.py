import setuptools

VERSION: str = "0.0.1"

setuptools.setup(
    name='GigaChat',
    packages=setuptools.find_packages(),
    version=VERSION,
    python_requires='>=3.8,<4.0',
    install_requires=[
        "Django==6.0.4",
        "djangorestframework==3.17.1",
        "djangorestframework_simplejwt==5.5.1",
        "django-cors-headers==4.9.0",
        "drf-spectacular==0.29.0"
    ]
)