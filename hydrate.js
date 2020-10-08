//  declare "sources" array so hydrate() can easily access JavaScript objects data.
let sources = [];

//  parseSourceString() fait le parsing de la string donnée et renvoie
//  les deux membre (un nom d'objet et un nom de variable)
//  la string commence par le nom de l'objet rangé dans sources, suivi de deux points
//  puis du nom de la variable à trouver dans l'objet.
function parseSourceString(sDataInner) {
  const inner = {
    source: sDataInner.split(":")[0],
    var: sDataInner.split(":")[1],
  };
  return inner;
}

function hydrateShowUnless() {}

function hydrateShowIf() {
  const targetElements = document.querySelectorAll(
    "[data-if]:not([data-if=''])"
  );

  targetElements.forEach((element) => {
    const evaluator = splitHydrationString(element.dataset.if);

    // value that should match the evaluator to warrant showing the element
    const value = sources[inner.source][inner.var];
  });
}

function hydrate() {
  //  select all elements with a non-empty "data-inner" attribute
  const targetElements = document.querySelectorAll(
    "[data-inner]:not([data-inner=''])"
  );

  targetElements.forEach((element) => {
    //  à partir de la string trouvée dans l'attribut "data-inner" de l'élément,
    //  fabriquer un objet "inner" contenant :
    //      1. inner.source : le nom de l'objet dans lequel aller récupérer le contenu
    //      2. inner.var : la variable contenant valeur  à insérer dans l'élément
    const inner = parseSourceString(element.dataset.inner);
    const innerContent = sources[inner.source][inner.var];

    switch (element.type) {
      // filling fields
      case "text":
      case "tel":
      case "email":
      case "number":
        element.value = innerContent;
        break;

      // checking radios
      case "radio":
        if (innerContent != element.value || innerContent != +element.value) {
          // make sure the radio is not checked if values don't match
          element.removeAttribute("checked");
        } else {
          // check the radio if values match
          element.setAttribute("checked", "checked");
        }
        break;

      // checking checkboxes
      case "checkbox":
        if (
          innerContent.includes(element.value) ||
          innerContent.includes(+element.value)
        ) {
          // make sure the checkbox is not checked if values don't match
          element.setAttribute("checked", "checked");
        } else {
          // check the checkbox if values match
          element.removeAttribute("checked");
        }
        break;
      //  filling other elements (div, p, span...)
      default:
        element.innerHTML = innerContent;
    }
  });
}
