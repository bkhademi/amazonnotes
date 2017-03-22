(function () {

    // =================
    // Local Variables
    // =================
    var noteClassIndex = 2;
    // =================
    // Local functions
    // =================
    function NoteModel(title, content, noteClass, id) {
        this.title = title;
        this.content = content;
        this.noteClass = noteClass;
        this.id = id;
    }

    // =================
    // Public Variables
    // =================
    var pageContainer = $('#page-container');
    var firstNoteButton = $('#first-note-button');
    var firstNoteTitle = $('.note-text-input', '#first-note');
    var mainLogo = $('#main-logo');
    var fabContainer = $('#create-fab');
    var createNoteFab = $('.create-note-fab', '#create-fab');
    var noteTemplate = $('#note-template').html();
    var notesContainerTemp = $('#note-container-template').html();
    var notes = [];
    // =================
    // Public Function
    // =================
    firstNoteTitle.keyup(firstNoteValidation);
    firstNoteTitle.keypress(createFirstNoteOnEnter);
    firstNoteButton.click(firstNoteCreate);
    createNoteFab.click(createNote);

    // =====================
    // On load Function Calls
    // =====================
    mainLogo.toggle();
    fabContainer.toggle();
    // =====================
    // Function Declarations
    // =====================


    function firstNoteValidation(event) {
        event.stopPropagation();
        if (!firstNoteTitle.val()) {
            firstNoteButton.addClass('note-submit-disabled');
        } else {
            firstNoteButton.removeClass('note-submit-disabled').addClass('note-submit');
        }
    }

    function createFirstNoteOnEnter(event) {
        event.stopPropagation();
        if (event.which === 13) {
            firstNoteCreate(event);
        }
    }

    function firstNoteCreate(event) {
        event.stopPropagation();
        if (firstNoteTitle.val().length > 0) {
            var firstNote = new NoteModel(firstNoteTitle.val(), null, 'note-1', 'note-0');
            notes.push(firstNote);
            $('#welcome-container').remove();
            pageContainer.addClass('page-container');
            $('#editable-notes-container').toggle();
            pageContainer.append(notesContainerTemp);
            notesGenerator(firstNote);
            mainLogo.toggle();
            fabContainer.toggle();
        }
    }

    function createNote(event) {
        event.stopPropagation();
        var newNote = new NoteModel('(untitled note)');
        notes.push(newNote);
        notes.forEach(function (note, i) {
            if (!note.noteClass) {
                var noteClass;
                note.id = 'note-' + i;
                if (noteClassIndex <= 8) {
                    noteClass = 'note-' + noteClassIndex;
                    note.noteClass = noteClass;
                    noteClassIndex += 1;
                } else {
                    noteClassIndex = 1;
                    noteClass = 'note-' + noteClassIndex;
                    note.noteClass = noteClass;
                }
            }
        });
        notesGenerator(newNote);
    }

    function notesGenerator(note) {
        var noteContainer = $('#notes-container');
        var noteTemp = noteTemplate.replace('{{title}}', note.title).replace('{{noteContent}}', note.content || '')
            .replace('{{id}}', note.id).replace('{{noteClass}}', note.noteClass || '');
        noteContainer.append(noteTemp);
        var noteHtml = $('#' + note.id);
        var noteTitle = $('.note-title', '#' + note.id);
        var noteClose = $('.delete-note', '#' + note.id);
        var noteTextArea = $('textarea', '#' + note.id);
        var noteColorChange = $('select', '#' + note.id);
        noteTitle.dblclick(note.id, editTitleActive);
        noteTitle.on('touchstart', note.id, editTitleActive);
        noteClose.click(noteHtml, deleteNote);
        noteClose.on('touchstart', noteHtml, deleteNote);
        noteColorChange.change(noteHtml, changeColor);
        noteTextArea.blur(function (event) {
            event.stopPropagation();
            saveTextContent(noteTextArea, note.id);
        });
    }


    function editTitleActive(event) {
        event.stopPropagation();
        var id = event.data;
        var currentNoteHeader = $('.note-header', '#' + id);
        var currentNoteTitle = $('.note-title', '#' + id);
        var currentTitleVal = currentNoteTitle.text();
        var inputHtml = '<input type="text" class="note-title-input" >';
        currentNoteHeader.empty();
        currentNoteHeader.append(inputHtml);
        var noteTitleInput = $('.note-title-input', '#' + id);
        noteTitleInput.val(currentTitleVal);
        noteTitleInput.blur(function (event) {
            event.stopPropagation();
            editTitleSave(id, currentNoteHeader, noteTitleInput);
        });
        noteTitleInput.keypress(function (event) {
            event.stopPropagation();
            if (event.which === 13) {
                editTitleSave(id, currentNoteHeader, noteTitleInput)
            }
        });
    }

    function editTitleSave(id, noteHeader, noteTitleInput) {
        var newTitleVal = noteTitleInput.val() || 'Untitled Note';
        var newTitleHtml = '<h2 class="note-title"></h2>';

        noteHeader.empty();
        noteHeader.append(newTitleHtml);
        notes[id.split('-')[1]].title = newTitleVal;
        var newTitle = $('.note-title', '#' + id);
        newTitle.text(newTitleVal);
        newTitle.dblclick(id, editTitleActive);
        newTitle.on('touchstart', id, editTitleActive);
    }

    function saveTextContent(noteTextArea, id) {
        notes[id.split('-')[1]].content = noteTextArea.val() || '';
    }

    function deleteNote(event) {
        event.preventDefault();
        event.stopPropagation();
        var note = event.data;
        note.remove();
    }

    function changeColor(event) {
        var color = "";
        var note = event.data;
        color = $(this).find(':selected').css('background-color');
        note.css({'background-color': color})
    }

})();