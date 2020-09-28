//  l'array "sources" est déclaré pour recevoir les différents objets jSON reçus
//  et permettre à hydrate() d'y accéder.
let sources = [];

//  splitHydrationString() fait le parsing de la string donnée et renvoie
//  les deux membre (un nom d'objet et un nom de variable)
//  la string commence par le nom de l'objet rangé dans sources, suivi de deux points
//  puis du nom de la variable à trouver dans l'objet.
function splitHydrationString(sDataInner) {
  const inner = {
    source: sDataInner.split(":")[0],
    var: sDataInner.split(":")[1],
  };
  return inner;
}

function hydrate() {
  const targetElements = document.querySelectorAll(
    "[data-inner]:not([data-inner=''])"
  );

  targetElements.forEach((element) => {
    //  à partir de la string trouvée dans l'attribut "data-inner" de l'élément,
    //  fabriquer un objet "inner" contenant :
    //      1. inner.source : le nom de l'objet dans lequel aller récupérer le contenu
    //      2. inner.var : la variable contenant valeur  à insérer dans l'élément
    const inner = splitHydrationString(element.dataset.inner);

    //
    const innerContent = sources[inner.source][inner.var];

    // traiter différemment les input fields, les radios/checkboxes et les autres éléments (div, p, span...)
    switch (element.type) {
      case "text":
      case "tel":
      case "email":
      case "number":
        element.value = innerContent;
        break;

      case "radio":
        if (element.value != innerContent || +element.value != innerContent) {
          // si l'input ne correspond pas à une valeur reçue, cacher le radio ET son label
          element.removeAttribute("checked");
        } else {
          // si l'input correspond à une valeur reçue, marque l'input comme étant sélectionné.
          element.setAttribute("checked", "checked");
        }
        break;

      case "checkbox":
        if (
          innerContent.includes(element.value) ||
          innerContent.includes(+element.value)
        ) {
          // si la valeur de la checkbox correspond à une valeur reçue, afficher le label concerné
          element.setAttribute("checked", "checked");
        } else {
          // si la valeur de la checkbox ne correspond pas à une valeur reçue, cacher la checkbox ET son label
          element.removeAttribute("checked");
        }
        break;

      default:
        // pour les autres éléments (div, p, span...) , insérer le nouveau contenu.
        element.innerHTML = innerContent;
    }

    // mettre les inputs en disabled : le form n'est pas éditable (juste informatif) au chargement de la page
    if (element.tagName == "INPUT") {
      element.setAttribute("disabled", "disabled");
    }
  });
}
