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
    var currentChapter = $('body').attr('id');

    // Make kbd clickable to select the text.
    $('kbd').on('click', function() {
        selectText(this);
    });

    // Build the ToC.
    $('#toc').toc({
        'selectors': 'section>h1,section>h2,section>h3'
    });

    // Make the current chapter active in the ToC.
    $('nav li').each(function() {
        var id = $(this).attr('id');
        if (id) {
            var idFields = id.split('_');
            if (idFields[0] == 'chapter' && idFields[1] == currentChapter)
                $(this).addClass('toc-active');
        }
    });

    // Remember contribution.
    if (localStorage.getItem("contributed")) {
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
        localStorage.setItem("contributed", true);
    });

    // User's chapter completion checkboxes.
    $('#chapter_list input').each(function() {
        var wasDone = localStorage.getItem($(this).attr('id'));
        this.checked = wasDone == 'true';
    });
    $('#chapter_list input').change(function() {
        localStorage.setItem($(this).attr('id'), this.checked);
    });

    // Enable parallax backgrounds.
    if( ! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
        $.stellar();
});

