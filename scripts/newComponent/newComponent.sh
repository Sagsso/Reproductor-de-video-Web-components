componentName=$1
mkdir -p ./components/$componentName/css ./components/$componentName/src
cp ./scripts/newComponent/templates/main.css  ./components/$componentName/css/
echo "class $componentName extends HTMLElement {" >> ./components/$componentName/src/$componentName.js
cat ./scripts/newComponent/templates/partial >> ./components/$componentName/src/$componentName.js
echo "\nwindow.customElements.define('app-REPLACEME', $componentName);" >> ./components/$componentName/src/$componentName.js
cp ./scripts/newComponent/templates/index.html  ./components/$componentName/