#!/usr/bin/env bash
# Revisión de costos del portfolio y de chat-agentes (solo lectura). Uso: bash scripts/revisar-costos.sh
set -euo pipefail
export MSYS_NO_PATHCONV=1
R=us-east-1
CUENTA=810249680029
INICIO=$(date -u +%Y-%m-01)
FIN=$(date -u -d "+1 day" +%Y-%m-%d)
SIN_CREDITOS='{"Not":{"Dimensions":{"Key":"RECORD_TYPE","Values":["Credit","Refund"]}}}'

echo "== Recursos con componente=chat-agentes"
aws resourcegroupstaggingapi get-resources --region $R --tag-filters Key=componente,Values=chat-agentes \
  --query 'ResourceTagMappingList[].ResourceARN' --output text | tr '\t' '\n'

echo; echo "== Gasto del mes por servicio (sin créditos), $INICIO a $FIN"
aws ce get-cost-and-usage --region $R --time-period Start=$INICIO,End=$FIN --granularity MONTHLY \
  --metrics UnblendedCost --filter "$SIN_CREDITOS" --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[].[Keys[0],Metrics.UnblendedCost.Amount]' --output text

for TAG in project componente; do
  echo; echo "== Gasto del mes por etiqueta $TAG"
  aws ce get-cost-and-usage --region $R --time-period Start=$INICIO,End=$FIN --granularity MONTHLY \
    --metrics UnblendedCost --filter "$SIN_CREDITOS" --group-by Type=TAG,Key=$TAG \
    --query 'ResultsByTime[0].Groups[].[Keys[0],Metrics.UnblendedCost.Amount]' --output text 2>&1 || true
done

echo; echo "== Contador interno de chat-agentes (USD)"
aws dynamodb get-item --region $R --table-name chat-agentes-gasto --key "{\"mes\":{\"S\":\"$(date -u +%Y-%m)\"}}" \
  --query 'Item.microUsd.N' --output text | awk '{ if ($1=="None") print 0; else printf "%.4f\n", $1/1000000 }'

echo; echo "== Budgets"
aws budgets describe-budgets --region $R --account-id $CUENTA \
  --query 'Budgets[].[BudgetName,BudgetLimit.Amount,CalculatedSpend.ActualSpend.Amount,CalculatedSpend.ForecastedSpend.Amount]' --output text

echo; echo "== Acción del budget chat-agentes"
aws budgets describe-budget-actions-for-budget --region $R --account-id $CUENTA --budget-name chat-agentes \
  --query 'Actions[].[Status,ActionThreshold.ActionThresholdValue]' --output text

echo; echo "== Políticas del rol chat-agentes-lambda (chat-agentes-freno = freno aplicado)"
aws iam list-attached-role-policies --role-name chat-agentes-lambda --query 'AttachedPolicies[].PolicyName' --output text
