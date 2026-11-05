#!/usr/bin/env bash
# Despliega el stack chat-agentes. Uso:
#   bash scripts/desplegar-chat-agentes.sh PerfilSistemaArn=<arn> FiltroBudget=etiqueta TopeUsd=8
set -euo pipefail

REGION=us-east-1
BUCKET=chat-agentes-despliegue-810249680029
STACK=chat-agentes

cd "$(dirname "$0")/.."

node scripts/chat-agentes-contenido.mjs

if ! aws s3api head-bucket --bucket "$BUCKET" --region "$REGION" 2>/dev/null; then
  aws s3 mb "s3://$BUCKET" --region "$REGION"
fi
aws s3api put-bucket-tagging --bucket "$BUCKET" --region "$REGION" \
  --tagging 'TagSet=[{Key=project,Value=portafolio},{Key=componente,Value=chat-agentes}]'
aws s3api put-public-access-block --bucket "$BUCKET" --region "$REGION" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

aws cloudformation package \
  --template-file infra/chat-agentes.yaml \
  --s3-bucket "$BUCKET" \
  --region "$REGION" \
  --output-template-file infra/.empaquetado.yaml

aws cloudformation deploy \
  --template-file infra/.empaquetado.yaml \
  --stack-name "$STACK" \
  --tags project=portafolio componente=chat-agentes \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$REGION" \
  --parameter-overrides "$@"

aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text
