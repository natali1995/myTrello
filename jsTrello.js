auth = '?key=1d1bd90e65ac671eb9465d61a6415c0f&token=9008204ec1091aa047280b28ce2ec2a8b71732e9d0893c9a9b5c370ba432c204';

$(document).ready(function(){

    $.get('https://api.trello.com/1/boards/635294a401114003db2357cc/lists' + auth, function(data) {
        for (let i = 0; i < data.length; i++) {
            drawAnyColumns(data[i].name, data[i].id);
            console.log('IdList', data[i].id);
        }
    })


    $.get('https://api.trello.com/1/boards/635294a401114003db2357cc/labels' + auth, function(data){
        for (let i = 0; i < data.length; i++){
            console.log('LabelsBoard', data[i].id, data[i].color);
        }
    })


    function drawAnyColumns(name, id){
        $('.lists').append('<div class="list ' + id + '">' + name + '</div>')
            .sortable();
    }

    $.get('https://api.trello.com/1/boards/635294a401114003db2357cc/cards' + auth, function(data){
        for (let i = 0; i < data.length; i++){
            drawCards(data[i].name, data[i].idList, data[i].id);
            console.log('IdCards', data[i].id);
        }
    })

    function drawCards(name, id, idCard){
        $('.' + id).append('<div class="card" id="' + idCard + '"><p class="nameTask" id="task' + idCard + '">' + name + '</p><button class="cardActions" id="actions' + idCard + '"><i class="fas fa-align-center"></i></button><div class="dialogs" id="dialog' + idCard + '" title="' + name + '"></div><button class="cardCancel1" id="cancel' + idCard + '">Cancel</button><button class="cardAdd" id="add' + idCard + '"><i class="far fa-plus-square"></i></button>' + '<button class="cardEdit" id="edit' + idCard + '"><i class="fas fa-pencil-alt"></i></button><button class="cardAddTrello" id="addTrello' + idCard + '"><i class="far fa-plus-square"></i></button><button class="cardCancel2" id="cancelAction' + idCard + '">Cancel</button><button class="cardDelete" id="delete' + idCard + '"><i class="fas fa-trash"></i></button></div>')

        $('.list').sortable({
            connectWith: '.list',
            stop: moveCard
        })

        addButtonAction(idCard);
        drawDialog(idCard);
    }

    function moveCard(event, ui){
        console.log('Event', event.toElement.offsetParent.classList[1]);
        console.log('Ui', ui.item[0].id);
        $.put('https://api.trello.com/1/cards/' + ui.item[0].id + auth + '&idBoard=635294a401114003db2357cc&idList=' + event.toElement.offsetParent.classList[1], function(result){})
    }

    $('.buttonList').click(function(){
        $.post('https://api.trello.com/1/cards' + auth + '&idList=635294a401114003db2357d3&name=' + '', function(result){
                console.log('Result', result.id);
                console.log('Post Request', result)
            addNewCard(result.id)
        });
    })

    function addNewCard(id){
        let thisId0 = '635294a401114003db2357d3'
        $('.' + thisId0).append('<div class="card" id="' + id + '"><textarea class="description" id="description' + id + '" name="description" cols="10" rows="6" maxlength="100" placeholder="Name task"></textarea><button class="cardActions" id="actions' + id + '"><i class="fas fa-align-center"></i></button><div class="dialogs" id="dialog' + id + '" title=""></div><button class="cardCancel1" id="cancel' + id + '">Cancel</button><button class="cardAdd" id="add' + id + '"><i class="far fa-plus-square"></i></button><button class="cardEdit" id="edit' + id + '"><i class="fas fa-pencil-alt"></i></button><button class="cardAddTrello" id="addTrello' + id + '"><i class="far fa-plus-square"></i></button><button class="cardCancel2" id="cancelAction' + id + '">Cancel</button><button class="cardDelete" id="delete' + id + '"><i class="fas fa-trash"></i></button></div>')

        addButtonAction(id);
        let edit = $('#edit' + id);
        edit.hide();
        let deleteCard = $('#delete' + id);
        deleteCard.hide();
        let cancel = $('#cancel' + id);
        cancel.show();
        let addTrello = $('#addTrello' + id);
        addTrello.show();
        let actions = $('#actions' + id);
        actions.hide();
        drawDialog(id);
    }

    function addButtonAction(idCard){
        console.log('AddButtonAction', idCard)
        let edit = $('#edit' + idCard);
        edit.show();

        let cancelAction = $('#cancelAction' + idCard);
        cancelAction.hide();

        let deleteCard = $('#delete' + idCard);
        deleteCard.show();

        let add = $('#add' + idCard);
        add.hide();

        let cancel = $('#cancel' + idCard);
        cancel.hide();

        let card = $('#' + idCard);

        let addTrello = $('#addTrello' + idCard);
        addTrello.hide();

        let actions = $('#actions' + idCard);

        let dialog = $('#dialog' + idCard);

        console.log('Button IdCard', idCard)

        console.log('Add', add);

        cancel.click(function(){
            card.remove();
            $.delete('https://api.trello.com/1/cards/' + idCard + auth, function(result){});
        })

        addTrello.click(function(){
            let nameTask = $('#description' + idCard);
            nameTask.replaceWith('<p class="nameTask" id="task' + idCard + '">' + nameTask.val() + '</p>');
            $.put('https://api.trello.com/1/cards/' + idCard + auth, {name: nameTask.val()}, function(result){});
            cancel.hide();
            $(this).hide();
            cancelAction.hide();
            edit.show();
            deleteCard.show();
            actions.show();
        })

        edit.click(function(){
            let task = $('#task' + idCard);
            console.log('textData',  edit.data('taskData'), 'task.text', task.text(), 'idCard', idCard);
            edit.data('taskData', task.text());
            let thisId = $(this).attr('id');
            let number = thisId.replace('edit', '');
            $('#task' + number).replaceWith('<textarea class="description" id="description' + idCard + '" name="description" cols="10" rows="6" maxlength="100" placeholder="Name task"></textarea>');
            $(this).hide();
            deleteCard.hide();
            add.hide();
            addTrello.show();
            cancelAction.show();
            actions.hide();
        });

        cancelAction.click(function(){
            // console.log(edit.data('taskData'));
            $('#description' + idCard).replaceWith('<p id="task' + idCard + '">' + edit.data('taskData') + '</p>')
            cancel.hide();
            add.hide();
            addTrello.hide();
            cancelAction.hide();
            edit.show();
            deleteCard.show();
            actions.show();
        })

        deleteCard.click(function(){
            card.remove();
            $.delete('https://api.trello.com/1/cards/' + idCard + auth, function(result){});
        })

        actions.click(function(){
            dialog.dialog('open');
        })

        dialog.dialog({
            buttons: [{text: 'Ok', class: "okButton", click: function(){$(this).dialog('close')}},
                {text: 'Cancel', class: "cancelButton", click: function(){$(this).dialog('close')}}],
            modal: true,
            autoOpen: false,
            width: 700,
            height: 800
        })
    }

    // Draw Dialog on the Card with actions, description and comments

    function drawDialog(id){
        $('.ui-icon-closethick').replaceWith('<i class="fas fa-times"></i>');
        $('#dialog' + id).append('<div class="descriptionsDialog" id="descriptionDialog' + id + '"></div><div class="differentActions" id="differentActions' + id + '"></div><div class="commentsDialog" id="commentDialog' + id + '"></div><div class="actionsDialog" id="actionDialog' + id + '"></div>');
        $('#descriptionDialog' + id).append('<h4>Descriptions...</h4><textarea id="descriptionCard' + id + '" cols="45" rows="8" maxlength="250" placeholder="Full description ..."></textarea><button class="saveDescription" id="saveDescription' + id + '">Save</button><button class="descriptionEdit" id="descriptionEdit' + id + '">Edit</button><button class="cancelDescription" id="cancelDescription' + id + '"><i class="fas fa-times"></i></button>');
        $('#commentDialog' + id).append('<h4>Comments...</h4><button class="comments" id="addComment' + id + '"><i class="fas fa-plus"></i> Add comment</button><div class="commentsDiv" id="commentDiv' + id + '"></div>');
        $('#actionDialog' + id).append('<button class="buttonLabels" id="buttonLabel' + id + '"><i class="fas fa-tags"></i> Labels</button><div class="dialogLabel" id="dialogLabel' + id +'" title="Labels"><h4>Labels</h4></div><button class="buttonCalenders" id="buttonCalendar' + id + '"><i class="far fa-calendar-alt"></i> Calendar</button><div class="dialogCalendar" id="dialogCalendar' + id +'" title="Calendar"><h4>Date</h4></div><button class="buttonChecklists" id="buttonChecklist' + id + '"><i class="far fa-check-circle"></i> Check-list</button><div class="dialogChecklist" id="dialogChecklist' + id +'" title="Checklist"><h4>Checklist</h4></div><button class="buttonAttachments" id="buttonAttachment' + id + '"><i class="fas fa-paperclip"></i> Attachment</button><div class="dialogAttachments" id="dialogAttachment' + id +'" title="Attachments"><h4>Attach link</h4></div>')

        $.get('https://api.trello.com/1/cards/' + id + auth, function(data){
            if (data.desc !== ''){
                drawDescription(id, data.desc);
            }
            else{
                dialogActionsDescription(id);
                let saveDescription = $('#saveDescription' + id);
                saveDescription.show();
                let descriptionEdit = $('#descriptionEdit' + id);
                descriptionEdit.hide();
            }

            if (data.due !== null){
                fieldCalendar(id, data.due.substr(0, 10));
                drawCalendar(id, data.due.substr(0, 10));
            }
            else {
                drawNewCalendar(id);
                fieldNewCalendar(id);
            }
            calendar(id);
            addCalendar(id);
            deleteCalendar(id);
            fieldLabel(id);
        })

        $.get('https://api.trello.com/1/cards/' + id +'/actions' + auth, function(data){
            for (let i = 0; i < data.length; i++){
                if (data[i].type === 'commentCard'){
                    // console.log(i);
                    console.log('True comments', data[i].data.text, data[i].id);
                    drawComments(id, data[i].data.text, data[i].id);
                }
            }
        })

        $('#addComment' + id).click(function(){
            $.post('https://api.trello.com/1/cards/' + id + '/actions/comments' + auth, {text: ' '}, function(result){
                console.log('Result for new comment', result.id);
                addNewComment(id, result.id);
            });
        })

        $.get('https://api.trello.com/1/boards/635294a401114003db2357cc/labels' + auth, function(data){
            for (let i = 0; i < data.length; i++){
                drawMenuLabels(id, data[i].id);
                addLabelOnCard(id, data[i].id);
            }
        })

        $.get('https://api.trello.com/1/cards/' + id + auth, function(data){
            for (let i = 0; i< data.idLabels.length; i++){
                console.log('Sone new', id, data.idLabels[i]);
                drawLabelOnCard(id, data.idLabels[i]);
            }
        })

        $.get('https://api.trello.com/1/cards/' + id + '/checklists' + auth, function(data){
            for (let i = 0; i < data.length; i++){
                console.log('Checklists', data[i].id, data[i].name);
                drawChecklistOnCard(id, data[i].id, data[i].name);
            }
        })

        $.get('https://api.trello.com/1/cards/' + id + '/attachments' + auth, function(data){
            for (let i = 0; i < data.length; i++){
                console.log('Attachments', id, data[i].id, data[i].name);
                drawAttachmentOnCard(id, data[i].id, data[i].name);
            }
        })

        actions(id);
        fieldActions(id);
        addCalendar(id);
        fieldChecklist(id);
        drawChecklist(id);
        addChecklist(id);
        fieldAttachment(id);
        drawAttachment(id);
        addAttachment(id);
    }

    // Add dialogs actions on the Card

    function actions(id){
        $('#buttonLabel' + id).click(function(){
            $('#dialogLabel' + id).dialog('open');
        });

        $('#dialogLabel' + id).dialog({
            modal: true,
            autoOpen: false,
            width: 250,
            height: 370
        });

        $('#buttonCalendar' + id).click(function(){
            $('#dialogCalendar' + id).dialog('open');
        });

        $('#dialogCalendar' + id).dialog({
            modal: true,
            autoOpen: false,
            with: 200,
            height: 400,
            buttons: [{text: 'Add', class: 'addCalendar', id: 'addCalendar' + id, click: function(){$(this).dialog('close')}},
                        {text: 'Remove', class: 'deleteCalendar', id: 'deleteCalendar' + id, click: function(){$(this).dialog('close')}}]
        });

        $('#buttonChecklist' + id).click(function(){
            $('#dialogChecklist' + id).dialog('open');
        });

        $('#dialogChecklist' + id).dialog({
            modal: true,
            autoOpen: false,
            with: 200,
            height: 310,
            buttons: [{text: 'Add', class: 'addChecklist', id: 'addChecklist' + id, click: function(){$(this).dialog('close')}}]
        });

        $('#buttonAttachment' + id).click(function(){
            $('#dialogAttachment' + id).dialog('open');
        })

        $('#dialogAttachment' + id).dialog({
            modal: true,
            autoOpen: false,
            with: 200,
            height: 300,
            buttons: [{text: 'Attach link', class: 'addLink', id: 'addLink' + id, click: function(){$(this).dialog('close')}}]
        })
    }

    // Draw and add Descriptions on the Card

    function drawDescription(id, name){
        $('#descriptionCard' + id).replaceWith('<p class="descriptionFull" id="descriptionFull' + id + '">' + name + '</p>');
        dialogActionsDescription(id);
    }

    function dialogActionsDescription(id){
        let saveDescription = $('#saveDescription' + id);
        let cancelDescription = $('#cancelDescription' + id);
        let descriptionEdit = $('#descriptionEdit' + id);
        saveDescription.hide();
        descriptionEdit.show();
        cancelDescription.hide();

        saveDescription.click(function(){
            let description = $('#descriptionCard' + id);
            description.replaceWith('<p class="descriptionFull" id="descriptionFull' + id + '">' + description.val() + '</p>');
            $.put('https://api.trello.com/1/cards/' + id + auth, {desc: description.val()}, function(result){})
            $(this).hide();
            cancelDescription.hide();
            descriptionEdit.show();
        });

        descriptionEdit.click(function(){
            let descriptionFull = $('#descriptionFull' + id);
            descriptionEdit.data('textDescriptionData', descriptionFull.text());
            let thisId = $(this).attr('id');
            let number = thisId.replace('descriptionEdit', '');
            $('#descriptionFull' + number).replaceWith('<textarea id="descriptionCard' + id + '" cols="45" rows="8" maxlength="250" placeholder="Full description ..."></textarea>');
            $(this).hide();
            saveDescription.show();
            cancelDescription.show();
        })

        cancelDescription.click(function(){
            let description = $('#descriptionCard' + id);
            description.replaceWith('<p class="descriptionFull" id="descriptionFull' + id + '">' + descriptionEdit.data('textDescriptionData') + '</p>')
            saveDescription.hide();
            descriptionEdit.show();
            $(this).hide();
        })
    }

    // Draw sections actions on the Card

    function fieldActions(id){
        $('#differentActions' + id).append('<div class="fieldLabels" id="fieldLabel' + id + '"></div><div class="fieldCalendars" id="fieldCalendar' + id + '"></div><div class="fieldChecklists" id="fieldChecklist' + id + '"></div><div class="fieldAttachments" id="fieldAttachment' + id + '"></div>')
    }

    // Draw labels on the Card

    function drawMenuLabels(id, idLabel){
        $('#dialogLabel' + id).append('<div class="label label' + idLabel + '" id="labelCheck' + idLabel + '' + id + '"></div>')
    }

    function fieldLabel(id){
        $('#fieldLabel' + id).append('<h4>Labels:</h4><div class="labelSection" id="labelSection' + id + '"></div>');
    }

    function drawLabelOnCard(id, idLabel){
        $('#labelSection' + id).append('<div class="label labelNew label' + idLabel + '" id="label' + idLabel + '' + id + '"></div>');
    }

    function addLabelOnCard(id, idLabel){
        $('#labelCheck' + idLabel + id).click(function(){
            let idMark = $('#label' + idLabel + id);
            if (idMark.hasClass('label' + idLabel)){
                idMark.remove();
                $.delete('https://api.trello.com/1/cards/' + id + '/idLabels/' + idLabel + auth, function(result){});
            }
            else {
                $('#labelSection' + id).append('<div class="label labelNew label' + idLabel + '" id="label' + idLabel + '' + id + '"></div>');
                $.post('https://api.trello.com/1/cards/' + id + '/idLabels' + auth, {value: idLabel}, function(result){});
            }
            console.log('https://api.trello.com/1/cards/' + id + '/idLabels' + auth, idLabel);
        })
    }

    // Draw calendar on the Card

    function drawCalendar(id, due){
        $('#dialogCalendar' + id).append('<p>Date: <input type="text" placeholder="Choose date" class="datepicker" id="datepicker' + id + '" value="' + due + '"></p>');
    }

    function drawNewCalendar(id){
        $('#dialogCalendar' + id).append('<p>Date: <input type="text" placeholder="Choose date" class="datepicker" id="datepicker' + id + '"></p>')
    }

    function addCalendar(id){
        $('#addCalendar' + id).click(function(){
            let date = $('#datepicker' + id).val();
            $('#calendarSection' + id).replaceWith('<div class="calendarSection" id="calendarSection' + id + '">' + date + '</div>');
            $.put('https://api.trello.com/1/cards/' + id + auth, {due: date}, function(result){});
        })
    }

    function deleteCalendar(id){
        $('#deleteCalendar' + id).click(function(){
            $('#calendarSection' + id).replaceWith('<div class="calendarSection" id="calendarSection' + id + '"></div>');
            // $('#datepicker' + id).attr(value, null);
            $.put('https://api.trello.com/1/cards/' + id + auth, {due: null}, function(result){});
        })
    }

    function calendar(id){
        $('#datepicker' + id).datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: 'https://engexpert.ru/wp-content/uploads/2013/04/Calendar.1.jpg',
            buttonImageOnly: true,
            buttonText: 'Choose date',
            minDate: 0
        });
    }

    function fieldCalendar(id, due){
        $('#fieldCalendar' + id).append('<h4>Date:</h4><div class="calendarSection" id="calendarSection' + id + '">' + due + '</div>');
    }

    function fieldNewCalendar(id){
        $('#fieldCalendar' + id).append('<h4>Date:</h4><div class="calendarSection" id="calendarSection' + id + '"</div>');
    }

    // Draw checkList on the Card

    function drawChecklist(id){
        $('#dialogChecklist' + id).append('<h5 class="inputChecklistHeading">Name</h5><input type="text" placeholder="Write name..." class="inputChecklist" id="inputChecklist' + id + '">');
    }

    function addChecklist(id){
        $('#addChecklist' + id).click(function(){
            $.post('https://api.trello.com/1/cards/' + id + '/checklists' + auth, {name: ''}, function(result){
                let checklistName = $('#inputChecklist' + id).val();
                console.log('Checklist Item', checklistName);
                $('#checklistSection' + id).append('<div class="checklist" id="checklist' + result.id + '"><div class="checklistItem" id="checklistItem' + result.id + '"><i class="far fa-check-circle"></i> ' + checklistName + '</div><button class="checklistItemEdit" id="checklistItemEdit' + result.id + '">Edit</button><button class="checklistItemDelete" id="checklistItemDelete' + result.id + '">Delete</button><button class="checklistItemSave" id="checklistItemSave' + result.id + '">Save</button><button class="checklistItemCancel" id="checklistItemCancel' + result.id + '">Cancel</button></div><button class="addCheckItem" id="addCheckItem' + result.id + '"><i class="fas fa-plus-circle"></i> Add checkItem</button><div class="checkItems" id="checkItems' + result.id + '"></div>');
                $.put('https://api.trello.com/1/checklists/' + result.id + auth, {name: checklistName}, function(result){});
                actionsChecklist(result.id);
                addNewCheckItem(result.id, id);
            });
        })
    }

    function fieldChecklist(id){
        $('#fieldChecklist' + id).append('<h4>Checklists:</h4><div class="checklistSection" id="checklistSection' + id + '"></div>');
    }

    function drawChecklistOnCard(id, idChecklist, name){
        $('#checklistSection' + id).append('<div class="checklist" id="checklist' + idChecklist + '"><div class="checklistItem" id="checklistItem' + idChecklist + '"><i class="far fa-check-circle"></i> ' + name + '</div><button class="checklistItemEdit" id="checklistItemEdit' + idChecklist + '">Edit</button><button class="checklistItemDelete" id="checklistItemDelete' + idChecklist + '">Delete</button><button class="checklistItemSave" id="checklistItemSave' + idChecklist + '">Save</button><button class="checklistItemCancel" id="checklistItemCancel' + idChecklist + '">Cancel</button></div><button class="addCheckItem" id="addCheckItem' + idChecklist + '"><i class="fas fa-plus-circle"></i> Add checkItem</button><div class="checkItems" id="checkItems' + idChecklist + '"></div>');
        actionsChecklist(idChecklist);
        $.get('https://api.trello.com/1/checklists/' + idChecklist + '/checkItems' + auth, function(data){
            for (let i = 0; i < data.length; i++){
                console.log('data items', data[i], data[i].id, data[i].name, data[i].state);
                if (data[i].state === 'complete'){
                    data[i].state = 'checked'
                }
                else {
                    data[i].state = 'unchecked'
                }
                drawCheckItemOnCard(idChecklist, data[i].id, data[i].name, id, data[i].state);
            }
        })
        addNewCheckItem(idChecklist, id);
    }

    function actionsChecklist(idChecklist){
        let checklistItemDelete = $('#checklistItemDelete' + idChecklist);
        let checklistItemEdit = $('#checklistItemEdit' + idChecklist);
        let checklistItemSave = $('#checklistItemSave' + idChecklist);
        checklistItemSave.hide();
        let checklistItemCancel = $('#checklistItemCancel' + idChecklist);
        checklistItemCancel.hide();

        checklistItemEdit.click(function(){
            let checklistItem = $('#checklistItem' + idChecklist);
            checklistItemEdit.data('textChecklistItem', checklistItem.text());
            let thisId = $(this).attr('id');
            let number = thisId.replace('checklistItemEdit', '');
            $('#checklistItem' + number).replaceWith('<input type="text" class="checklistItemChanged" id="checklistItemChanged' + idChecklist + '" value="' + checklistItem.text() + '">');
            $(this).hide();
            checklistItemDelete.hide();
            checklistItemSave.show();
            checklistItemCancel.show();
        });

        checklistItemCancel.click(function(){
            let checklistItemNew = $('#checklistItemChanged' + idChecklist);
            checklistItemNew.replaceWith('<div class="checklistItem" id="checklistItem' + idChecklist + '">' + checklistItemEdit.data('textChecklistItem') + '</div>');
            $(this).hide();
            checklistItemSave.hide();
            checklistItemEdit.show();
            checklistItemDelete.show();
        });

        checklistItemSave.click(function(){
            let checklistItemNew = $('#checklistItemChanged' + idChecklist);
            checklistItemNew.replaceWith('<div class="checklistItem" id="checklistItem' + idChecklist + '">' + checklistItemNew.val() + '</div>');
            $.put('https://api.trello.com/1/checklists/' + idChecklist + auth, {name: checklistItemNew.val()}, function(result){});
            $(this).hide();
            checklistItemCancel.hide();
            checklistItemDelete.show();
            checklistItemEdit.show();
        });

        checklistItemDelete.click(function(){
            $('#checklist' + idChecklist).remove();
            $('#checkItems' + idChecklist).remove();
            $('#addCheckItem' + idChecklist).remove();
            $.delete('https://api.trello.com/1/checklists/' + idChecklist + auth, function (result){});
        })
    }

    // Draw CheckItems on the Card

    function addNewCheckItem(idChecklist, id){
        $('#addCheckItem' + idChecklist).click(function(){
            $.post('https://api.trello.com/1/checklists/' + idChecklist + '/checkItems' + auth, {name: ' '}, function(result){
                $('#checkItems' + idChecklist).append('<div class="checkItem" id="checkItem' + result.id + '"><input type="text" class="checkItemTaskInput" id="checkItemTaskInput' + result.id + '"><button class="buttonCheckItemEdit" id="buttonCheckItemEdit' + result.id + '">Edit</button><button class="buttonCheckItemDelete" id="buttonCheckItemDelete' + result.id + '">Delete</button><button class="buttonCheckItemSave" id="buttonCheckItemSave' + result.id + '">Save</button><button class="buttonCheckItemCancel" id="buttonCheckItemCancel' + result.id + '">Cancel</button><button class="buttonCheckItemCancel2" id="buttonCheckItemCancel2' + result.id + '">Cancel</button></div>')

                console.log('Result satte', result.state);
                if (result.state === 'complete'){
                    result.state = 'checked'
                }
                else {
                    result.state = 'unchecked'
                }
                console.log('Result State Changed', result.state);

                actionsCheckItem(result.id, id, result.state);
                let checkItemEdit = $('#buttonCheckItemEdit' + result.id);
                checkItemEdit.hide();
                let checkItemDelete = $('#buttonCheckItemDelete' + result.id);
                checkItemDelete.hide();
                let checkItemSave = $('#buttonCheckItemSave' + result.id);
                checkItemSave.show();
                let checkItemCancel = $('#buttonCheckItemCancel' + result.id);
                checkItemCancel.hide();
                let checkItemCancel2 = $('#buttonCheckItemCancel2' + result.id);
                checkItemCancel2.show();
            })
        })
    }

    function drawCheckItemOnCard(idChecklist, idCheckItem, checkItemName, id, complete){
        $('#checkItems' + idChecklist).append('<div class="checkItem" id="checkItem' + idCheckItem + '"><div class="checkItemTask" id="checkItemTask' + idCheckItem + '"><input class="checkboxItem" id="checkboxItem' + idCheckItem + '" type="checkbox" name="a" value="' + checkItemName + '"' + complete + '> ' + checkItemName + '</div><button class="buttonCheckItemEdit" id="buttonCheckItemEdit' + idCheckItem + '">Edit</button><button class="buttonCheckItemDelete" id="buttonCheckItemDelete' + idCheckItem + '">Delete</button><button class="buttonCheckItemSave" id="buttonCheckItemSave' + idCheckItem + '">Save</button><button class="buttonCheckItemCancel" id="buttonCheckItemCancel' + idCheckItem + '">Cancel</button></div>')
        if (complete === 'checked'){
            $('#checkItemTask' + idCheckItem).css('color', '#7a0099')
                .css('text-decoration', 'line-through');
        }
        actionsCheckItem(idCheckItem, id, complete);
    }

    function addRemoveChecked(idCheckItem, id){
        $('#checkboxItem' + idCheckItem).click(function(){
            if ($(this).attr('checked') !== 'checked'){
                $('#checkItemTask' + idCheckItem).css('color', '#7a0099')
                    .css('text-decoration', 'line-through');
                $(this).attr('checked', 'checked');
                $.put('https://api.trello.com/1/cards/' + id + '/checkItem/' + idCheckItem + auth, {state: 'complete'}, function(result){});
            }
            else {
                $('#checkItemTask' + idCheckItem).css('color', 'black')
                    .css('text-decoration', 'none');
                $(this).attr('checked', 'unchecked');
                $.put('https://api.trello.com/1/cards/' + id + '/checkItem/' + idCheckItem + auth, {state: 'incomplete'}, function(result){})
            }
        })
    }

    function actionsCheckItem(idCheckItem, id, complete){
        addRemoveChecked(idCheckItem, id);

        let checkItemEdit = $('#buttonCheckItemEdit' + idCheckItem);
        let checkItemDelete = $('#buttonCheckItemDelete' + idCheckItem);
        let checkItemSave = $('#buttonCheckItemSave' + idCheckItem);
        checkItemSave.hide();
        let checkItemCancel = $('#buttonCheckItemCancel' + idCheckItem);
        checkItemCancel.hide();
        let checkItemCancel2 = $('#buttonCheckItemCancel2' + idCheckItem);
        checkItemCancel2.hide();

        checkItemCancel2.click(function(){
            $('#checkItem' + idCheckItem).remove();
            $.delete('https://api.trello.com/1/cards/' + id + '/checkItem/' + idCheckItem + auth, function(result){});
        })

        checkItemEdit.click(function(){
            let checkItem = $('#checkItemTask' + idCheckItem);
            checkItemEdit.data('textCheckItem', checkItem.text());
            let thisId = $(this).attr('id');
            let number = thisId.replace('buttonCheckItemEdit', '');
            $('#checkItemTask' + number).replaceWith('<input type="text" class="checkItemTaskInput" id="checkItemTaskInput' + idCheckItem + '" value="' + checkItem.text() + '"' + complete + '>');
            $(this).hide();
            checkItemDelete.hide();
            checkItemSave.show();
            checkItemCancel.show();
            checkItemCancel2.hide();
        })

        checkItemCancel.click(function(){
            let checkItemNew = $('#checkItemTaskInput' + idCheckItem);
            checkItemNew.replaceWith('<div class="checkItemTask" id="checkItemTask' + idCheckItem + '"><input class="checkboxItem" id="checkboxItem' + idCheckItem + '" type="checkbox" name="a" value=" ' + checkItemEdit.data('textCheckItem') + '" ' + complete + '>' + checkItemEdit.data('textCheckItem') + '</div>');
            $(this).hide();
            checkItemSave.hide();
            checkItemEdit.show();
            checkItemDelete.show();
            checkItemCancel2.hide();

            addRemoveChecked(idCheckItem, id);
        })

        checkItemSave.click(function(){
            let checkItemNew = $('#checkItemTaskInput' + idCheckItem);
            $.put('https://api.trello.com/1/cards/' + id + '/checkItem/' + idCheckItem + auth, {name: checkItemNew.val()}, function(result){});

            checkItemNew.replaceWith('<div class="checkItemTask" id="checkItemTask' + idCheckItem + '"><input class="checkboxItem" id="checkboxItem' + idCheckItem + '" type="checkbox" name="a" value="' + checkItemNew.val() + '" ' + complete + '> ' + checkItemNew.val() + '</div>');
            $(this).hide();
            checkItemCancel.hide();
            checkItemEdit.show();
            checkItemDelete.show();
            checkItemCancel2.hide();

            addRemoveChecked(idCheckItem, id);
        })

        checkItemDelete.click(function(){
            $('#checkItem' + idCheckItem).remove();
            $.delete('https://api.trello.com/1/cards/' + id + '/checkItem/' + idCheckItem + auth, function(result){});
        })
    }

    // Draw Attachments on the Card

    function drawAttachment(id){
        $('#dialogAttachment' + id).append('<input type="text" placeholder="Attach the link..." class="inputAttachment" id="inputAttachment' + id + '">');
    }

    function addAttachment(id){
        $('#addLink' + id).click(function(){
            let inputLink = $('#inputAttachment' + id);
            $.post('https://api.trello.com/1/cards/' + id + '/attachments' + auth, {url: 'https://' + ' '}, function(result){
                let thisHttp = inputLink.val();
                let newHttp = thisHttp.replace('https://', '');
                $('#attachmentSection' + id).append('<div class="attachment" id="attachment' + result.id + '"><a href="https://' + newHttp + '" target="_blank"><img src="https://st4.depositphotos.com/27867620/30591/v/450/depositphotos_305918244-stock-illustration-attach-web-icon-simple-illustration.jpg" class="attachmentImg" id="attachmentImg' + result.id + '" width="100" alt=""></a><div class="attachmentDescription" id="attachmentDescription' + result.id + '">https://' + newHttp + '</div><button class="attachmentEdit" id="attachmentEdit' + result.id + '">Edit</button><button class="attachmentDelete" id="attachmentDelete' + result.id + '">Delete</button><button class="attachmentSave" id="attachmentSave' + result.id + '">Update</button><button class="attachmentCancel" id="attachmentCancel' + result.id + '">Cancel</button></div>');
                $.put('https://api.trello.com/1/cards/' + id + '/attachments/' + result.id + auth, {name: 'https://' + inputLink.val()}, function(result){});
                actionsAttachment(id, result.id);
            })
        })
    }

    function fieldAttachment(id){
        $('#fieldAttachment' + id).append('<h4>Attachments:</h4><div class="attachmentSection" id="attachmentSection' + id + '"></div>')
    }

    function drawAttachmentOnCard(id, idAttachment, name){
        $('#attachmentSection' + id).append('<div class="attachment" id="attachment' + idAttachment + '"><a href="' + name + '" target="_blank"><img src="https://st4.depositphotos.com/27867620/30591/v/450/depositphotos_305918244-stock-illustration-attach-web-icon-simple-illustration.jpg" class="attachmentImg" id="attachmentImg' + idAttachment + '" width="100" alt=""></a><div class="attachmentDescription" id="attachmentDescription' + idAttachment + '">' + name + '</div><button class="attachmentEdit" id="attachmentEdit' + idAttachment + '">Edit</button><button class="attachmentDelete" id="attachmentDelete' + idAttachment + '">Delete</button><button class="attachmentSave" id="attachmentSave' + idAttachment + '">Update</button><button class="attachmentCancel" id="attachmentCancel' + idAttachment + '">Cancel</button></div>');
        actionsAttachment(id, idAttachment);
    }

    function actionsAttachment(id, idAttachment){
        let editAttachment = $('#attachmentEdit' + idAttachment);
        let deleteAttachment = $('#attachmentDelete' + idAttachment);
        let saveAttachment = $('#attachmentSave' + idAttachment);
        saveAttachment.hide();
        let cancelAttachment = $('#attachmentCancel' + idAttachment);
        cancelAttachment.hide();

        editAttachment.click(function(){
            let attachment = $('#attachmentDescription' + idAttachment);
            editAttachment.data('textAttachment', attachment.text());
            let thisId = $(this).attr('id');
            let number = thisId.replace('attachmentEdit', '');
            $('#attachmentDescription' + number).replaceWith('<input type="text" class="newInputAttachment" id="newInputAttachment' + idAttachment + '" value="' + attachment.text() + '">');
            $(this).hide();
            deleteAttachment.hide();
            saveAttachment.show();
            cancelAttachment.show();
        })

        saveAttachment.click(function(){
            let newAttachment = $('#newInputAttachment' + idAttachment);
            newAttachment.replaceWith('<div class="attachmentDescription" id="attachmentDescription' + idAttachment + '">' + newAttachment.val() + '</div>');
            $.put('https://api.trello.com/1/cards/' + id + '/attachments/' + idAttachment + auth, {name: newAttachment.val()}, function(result){});
            $(this).hide();
            cancelAttachment.hide();
            editAttachment.show();
            deleteAttachment.show();
        })

        cancelAttachment.click(function(){
            let newAttachment = $('#newInputAttachment' + idAttachment);
            newAttachment.replaceWith('<div class="attachmentDescription" id="attachmentDescription' + idAttachment + '">' + editAttachment.data('textAttachment') + '</div>');
            $(this).hide();
            saveAttachment.hide();
            deleteAttachment.show();
            editAttachment.show();
        })

        deleteAttachment.click(function(){
            $('#attachment' + idAttachment).remove();
            $.delete('https://api.trello.com/1/cards/' + id + '/attachments/' + idAttachment + auth, function(result){});
        })
    }

    // Draw Comments on the Card

    function drawComments(id, nameComment, idComment){
        $('#commentDiv' + id).append('<div class="definiteComment" id="definiteComment' + idComment + '"><p class="commentsFull" id="commentFull' + idComment + '">' + nameComment + '</p><button class="saveComments" id="saveComment' + idComment + '">Save</button><button class="commentEdit" id="commentEdit' + idComment + '">Edit</button><button class="deleteComment" id="deleteComment' + idComment + '"><i class="fas fa-ban"></i></button><button class="cancelComment" id="cancelComment' + idComment + '"><i class="fas fa-times"></i></button></div>')
        dialogActionsComments(id, idComment);
    }

    function addNewComment(id, idComment){
        $('#commentDiv' + id).prepend('<div class="definiteComment" id="definiteComment' + idComment + '"><textarea id="commentNew' + idComment + '" cols="50" rows="5" maxlength="150" placeholder="Write me ..."></textarea><button class="saveComments" id="saveComment' + idComment + '">Save</button><button class="commentEdit" id="commentEdit' + idComment + '">Edit</button><button class="deleteComment" id="deleteComment' + idComment + '"><i class="fas fa-ban"></i></button><button class="cancelComment" id="cancelComment' + idComment + '"><i class="fas fa-times"></i></button></div>');
        dialogActionsComments(id, idComment);
        let saveComment = $('#saveComment' + idComment);
        saveComment.show();
        let commentEdit = $('#commentEdit' + idComment);
        commentEdit.hide();
        let deleteComment = $('#deleteComment' + idComment);
        deleteComment.hide();
    }

    function dialogActionsComments(id, idAction){
        console.log('Id for comment', idAction, 'idCard', id);
        let saveComment = $('#saveComment' + idAction);
        saveComment.hide();
        let cancelComment = $('#cancelComment' + idAction);
        cancelComment.hide();
        let commentEdit = $('#commentEdit' + idAction);
        let deleteComment = $('#deleteComment' + idAction);

        saveComment.click(function(){
            let commentNew = $('#commentNew' + idAction);
            commentNew.replaceWith('<p class="commentsFull" id="commentFull' + idAction + '">' + commentNew.val() + '</p>');
            $.put('https://api.trello.com/1/cards/' + id + '/actions/' + idAction + '/comments' + auth, {text: commentNew.val()}, function(result){})
            $(this).hide();
            cancelComment.hide();
            commentEdit.show();
            deleteComment.show();
        });

        commentEdit.click(function(){
            let commentFull = $('#commentFull' + idAction);
            commentEdit.data('textCommentEdit', commentFull.text());
            let thisId = $(this).attr('id');
            let number = thisId.replace('commentEdit', '');
            $('#commentFull' + number).replaceWith('<textarea id="commentNew' + idAction + '" cols="50" rows="5" maxlength="150" placeholder="Write me ..."></textarea>');
            $(this).hide();
            deleteComment.hide();
            cancelComment.show();
            saveComment.show();
        })

        cancelComment.click(function(){
            let comment = $('#commentNew' + idAction);
            comment.replaceWith('<p class="commentsFull" id="commentFull' + idAction + '">' + commentEdit.data('textCommentEdit') + '</p>');
            saveComment.hide();
            commentEdit.show();
            $(this).hide();
            deleteComment.show();
        })

        deleteComment.click(function(){
            $('#definiteComment' + idAction).remove();
            $.delete('https://api.trello.com/1/cards/' + id + '/actions/' + idAction + '/comments' + auth, function(result){});
        })
    }
})