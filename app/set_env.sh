# This file is used for convenience of local development.
# DO NOT STORE YOUR CREDENTIALS INTO GIT


export POSTGRES_USERNAME=postgres
export POSTGRES_PASSWORD=postgres927319
export POSTGRES_HOST=mystoredb1.cqc8bwsn9skh.us-east-1.rds.amazonaws.com
export POSTGRES_DB=postgres
export AWS_BUCKET=arn:aws:s3:::mystorebucket927319
# arn:aws:s3:::elasticbeanstalk-us-east-1-204546021765/MyStore/
export AWS_REGION=us-east-1
export AWS_PROFILE=default
export JWT_SECRET=mysecretstring
export URL=http://localhost:8100



# use it with wsl better:
# wsl bash -c "source /mnt/c/Users/saleh/Desktop/MyStore/app/set_env.sh"



# inside wsl (worked actually):
# cd /mnt/c/Users/saleh/Desktop/MyStore/app
# source set_env.sh
# echo $POSTGRES_USERNAME
# echo $POSTGRES_HOST
