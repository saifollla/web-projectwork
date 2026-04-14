## Setup

1. Make virtual environment `python -m venv .venv`
2. Activate virtual environment:
    - Linux / MacOS `source .venv/bin/activate`
    - Windows `.\.venv\Scripts\activate`
3. Install requirements `pip install .`
4. Run migrations `python manage.py migrate`
5. Start server `python manage.py runserver`