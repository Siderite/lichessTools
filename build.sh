# Define variables
# inspiered by
# https://github.com/MagicJinn/Youtube-DougDougify/raw/4e500fa7a9b8516e87d008cd210c84d6d3b782e6/build.bat

ZIP_NAME_FIREFOX="Firefox.zip"
ZIP_NAME_CHROMIUM="Chromium.zip"
SOURCE_FOLDER=$(pwd)
TEMP_FOLDER="temp"

# Ensure the temp folder is clean
if [ -d "${TEMP_FOLDER}" ]; then
	rm -rf "${TEMP_FOLDER}"
fi

mkdir "${TEMP_FOLDER}"

# Copy files and folders individually to avoid cyclic copy
echo "Copying files to the temp directory..."
cp -r "${SOURCE_FOLDER}/images" "${TEMP_FOLDER}/images"
cp -r "${SOURCE_FOLDER}/manifest.json" "${TEMP_FOLDER}"
cp -r "${SOURCE_FOLDER}/popup.html" "${TEMP_FOLDER}"
cp -r "${SOURCE_FOLDER}/scripts" "${TEMP_FOLDER}/scripts"
cp -r "${SOURCE_FOLDER}/styles" "${TEMP_FOLDER}/styles"
cp -r "${SOURCE_FOLDER}/tools" "${TEMP_FOLDER}/tools"

# Create Firefox zip folder using 7-Zip
echo "Creating Firefox zip folder..."
cd $TEMP_FOLDER || exit
zip -r "${SOURCE_FOLDER}/${ZIP_NAME_FIREFOX}" "./"
cd ..
echo "Firefox zip folder created successfully."

# Ensure the temp folder is clean
if [ -d "${TEMP_FOLDER}" ]; then
	rm -rf "${TEMP_FOLDER}"
fi
mkdir "${TEMP_FOLDER}"

# Copy files and folders for Chromium
cp -r "${SOURCE_FOLDER}/images" "${TEMP_FOLDER}/images"
cp -r "${SOURCE_FOLDER}/manifest v3.json" "${TEMP_FOLDER}"
cp -r "${SOURCE_FOLDER}/popup.html" "${TEMP_FOLDER}"
cp -r "${SOURCE_FOLDER}/scripts" "${TEMP_FOLDER}/scripts"
cp -r "${SOURCE_FOLDER}/styles" "${TEMP_FOLDER}/styles"
cp -r "${SOURCE_FOLDER}/tools" "${TEMP_FOLDER}/tools"

# Rename manifest for Chromium
echo "Preparing files for Chromium zip..."
mv "${TEMP_FOLDER}/manifest v3.json" "${TEMP_FOLDER}/manifest.json"

# Create Chromium zip folder using 7-Zip
echo "Creating Chromium zip folder..."
cd $TEMP_FOLDER || exit
zip -r "${SOURCE_FOLDER}/${ZIP_NAME_CHROMIUM}" "./"
cd ..
echo "Chromium zip folder created successfully."

# Cleanup
if [ -d "${TEMP_FOLDER}" ]; then
	rm -rf "${TEMP_FOLDER}"
fi

echo "All operations completed successfully."
