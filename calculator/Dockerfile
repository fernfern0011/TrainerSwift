FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./calculator.py .
COPY ./dbConnection.py .
COPY ./config.py .
COPY ./database.ini .
CMD [ "python", "./calculator.py"]