function selectText(element) {
    var doc = document, range, selection;    

    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

$(function(){
    // Enable parallax backgrounds.
    if( ! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
        $.stellar();

    // Remember contribution.
    if (localStorage.getItem('contributed')) {
        $('.contribute form').hide();
        $('.contribute .thanks').show();
    } else {
        $('.contribute form').show();
        $('.contribute .thanks').hide();
    }
    $('.contribute .thanks .toggle').click(function() {
        $('.contribute form').show();
        $('.contribute .thanks').hide();
    });
    $('.contribute form').submit(function() {
        localStorage.setItem('contributed', true);
    });

    // User's chapter completion checkboxes.
    $('#chapter_list input').each(function() {
        var wasDone = localStorage.getItem($(this).attr('id'));
        this.checked = wasDone == 'true';
    });
    $('#chapter_list input').change(function() {
        localStorage.setItem($(this).attr('id'), this.checked);
    });

    // Build the ToC.
    $('#toc').toc({
        'selectors': 'section>h1,section>h2,section>h3'
    });

    // Make the current chapter active in the ToC.
    var currentChapter = $('body').attr('id');
    $('nav li').each(function() {
        var id = $(this).attr('id');
        if (id) {
            var idFields = id.split('_');
            if (idFields[0] == 'chapter' && idFields[1] == currentChapter)
                $(this).addClass('toc-active');
        }
    });

    // Make kbd clickable to select the text.
    $('kbd').on('click', function() {
        selectText(this);
    });

    // Add paragraph and heading links.
    var h1 = 0, h2 = 0, h3 = 0, p = 0, t = 0, a = 0, scope_hint = '';
    $('section>h1, section>h2, section>h3, section>p, section>dl>dt, section>aside').each(function() {
        var id = '', hint = scope_hint;
        if ("h1" == this.tagName.toLowerCase()) {
            ++h1;
            h2 = 0;
            h3 = 0;
            p = 0;
            t = 0;
            a = 0;
            id = 'h' + h1;
            hint = scope_hint = this.innerText.replace(/ /g, '_')
        }
        else if ("h2" == this.tagName.toLowerCase()) {
            ++h2;
            h3 = 0;
            p = 0;
            t = 0;
            a = 0;
            id = 'h' + h1 + '.' + h2;
            hint = scope_hint = this.innerText.replace(/ /g, '_')
        }
        else if ("h3" == this.tagName.toLowerCase()) {
            ++h3;
            p = 0;
            t = 0;
            a = 0;
            id = 'h' + h1 + '.' + h2 + '.' + h3;
            hint = scope_hint = this.innerText.replace(/ /g, '_')
        }
        else if ("p" == this.tagName.toLowerCase()) {
            ++p;
            id = 'p' + h1 + '.' + h2 + '.' + h3 + '_' + p;
        }
        else if ("dt" == this.tagName.toLowerCase()) {
            ++t;
            id = 't' + h1 + '.' + h2 + '.' + h3 + '_' + t;
            hint = this.innerText.replace(/ /g, '_')
        }
        else if ("aside" == this.tagName.toLowerCase()) {
            ++a;
            id = 'a' + h1 + '.' + h2 + '.' + h3 + '_' + a;
        }

        $(this).attr('id', id);
        $('<a>#</a>').prependTo(this).addClass('bookmark').attr('href', (hint? '?=' + hint: '') + '#' + id);
    });
});

