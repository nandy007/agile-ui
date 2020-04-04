
var util = module.exports = {
    getAnestor: function(anestor){
        return (typeof anestor.getReplacement === 'function' ? anestor.getReplacement() : anestor.replacement ) || anestor;
    },
    insertAfter: function (newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },
    addChild: function ($child, jsDom) {
        var $parent = $child.parentNode, $start = document.createComment(''), $end = document.createComment('');
        $start.refer = $end.refer = jsDom;
        $parent.insertBefore($start, $child);
        util.insertAfter($end, $child);
        jsDom.slotParent = $parent;
        jsDom.slotPosition = {
            start: $start,
            end: $end
        };
    },
    createComp: function (jsDom, template) {
        const $fragment = document.createDocumentFragment();
        Array.from(jsDom.childNodes).forEach(function ($child) {
            $fragment.appendChild($child);
        });

        jsDom.innerHTML = template;
        const $child = jsDom.querySelector('child');
        if ($child) {
            util.addChild($child, jsDom)
            $child.parentNode.replaceChild($fragment, $child);
        }
    }
}