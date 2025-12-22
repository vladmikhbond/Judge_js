FROM node:20-alpine

COPY src /src
                                 
EXPOSE 7012

CMD ["python", "-m", "src.main"]