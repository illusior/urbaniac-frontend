#!/usr/bin/env bash

# Launch from frontend's root foler

. ./.docker/.scripts/contains_element.sh

# Ask user for build type
buildType=$1

buildProdType="prod"
buildPreviewType="preview"
buildDevType="dev"

buildTypeAllowed=($buildPreviewType $buildDevType $buildProdType)

if ! contains_element $buildType ${buildTypeAllowed[@]} ; then
  buildType=$buildPreviewType
fi

composeArgs=()
if [ $buildType == $buildDevType ]; then
  composeArgs+=( "-f ./.docker/compose.override.yml" )
fi

if [ $buildType == $buildDevType ] || [ $buildType == $buildPreviewType ]; then
  composeArgs+=( "-f ./.docker/compose.watch.$buildType.yml" )
fi

finalComand="docker compose \
    --env-file ./.docker/.${buildType}.env \
    -f ./.docker/compose.yml \
    ${composeArgs[@]} \
    up \
    --build \
    --wait"

echo "Launching this command:"
echo $finalComand
echo ""

$finalComand
