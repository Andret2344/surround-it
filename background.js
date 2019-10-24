const parentheses = [
    {l: '(', r: ')'},
    {l: '{', r: '}'},
    {l: '<', r: '>'},
    {l: '[', r: ']'},
    {l: '\'', r: '\''},
    {l: '"', r: '"'}
];

if ($ !== undefined) {
    $(document).on('keypress', 'input, textarea', function (e) {
        var $this = $(this);
        if (getSelectedText($this)) {
            var number = parentheses.map(x => x.l).indexOf(e.key);
            if (number !== -1) {
                var selected = parentheses[number];
                e.preventDefault();
                setSelectedText($this, selected.l + getSelectedText($this) + selected.r);
            }
        }
    });

    $(document).on('keypress', '[contenteditable]', function (e) {
        var $this = $(this);
        var selectedTextForContentEditable = getSelectedTextForContentEditable($this);
        if (selectedTextForContentEditable) {
            console.log(e.key);
            var number = parentheses.map(x => x.l).indexOf(e.key);
            if (number !== -1) {
                var selected = parentheses[number];
                e.preventDefault();
                var $that = $this.parent().find(":contains('" + selectedTextForContentEditable + "'):not(:has(*))");
                setSelectedTextForContentEditable($that, selected.l + selectedTextForContentEditable + selected.r);
            }
        }
    });

    function getSelectionRange() {
        return window.getSelection().getRangeAt(0);
    }

    function setSelectedTextForContentEditable($obj, text) {
        var range = getSelectionRange();
        var start = range.startOffset;
        var end = range.endOffset;
        $obj[0].innerText = $obj[0].innerText.substring(0, start) + text + $obj.val().substring(end);
        range.endOffset = end + 1;
        range.startOffset = start + 1;
        window.getSelection().addRange(range);
    }

    function getSelectedTextForContentEditable($obj) {
        var range = getSelectionRange();
        var start = range.startOffset;
        var end = range.endOffset;
        var sel = $obj[0].innerText.substring(start, end);
        return sel;
    }

    function setSelectedText($obj, text) {
        var start = $obj[0].selectionStart;
        var end = $obj[0].selectionEnd;
        $obj.val($obj.val().substring(0, start) + text + $obj.val().substring(end));
        $obj[0].selectionStart = start + 1;
        $obj[0].selectionEnd = end + 1;
    }

    function getSelectedText($obj) {
        var start = $obj[0].selectionStart;
        var end = $obj[0].selectionEnd;
        var sel = $obj.val().substring(start, end);
        return sel;
    }
}
