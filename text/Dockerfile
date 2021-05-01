FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m nltk.downloader -d /usr/local/share/nltk_data wordnet

WORKDIR /opt/work
#COPY . .

#CMD [ "python", "./your-daemon-or-script.py" ]