FROM ubuntu

RUN apt-get update && \
    apt-get install -y nodejs && \
    apt-get install -y phantomjs

RUN mkdir /test/
ADD . /test/
WORKDIR /test/

ENTRYPOINT phantomjs phestum.js piexif.js && nodejs nodetest.js