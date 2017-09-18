    riot.tag2('new-table', '<head> <title>RiotJs | Articles Management</title> </head> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="table-responsive"> <body> <h1 class="text-primary text-center">Articles Management</h1> <div id="dialog-create">  <button type="button" class="create btn btn-primary" data-toggle="modal" data-target="#create" data-title="Create"> Create <span class="glyphicon glyphicon-pencil"></span></button> </div> <table class="table table-bordred table-striped"> <thead id="orders"> <th>Title</th> <th>Content</th> <th>Created</th> <th>Updated</th> <th>Edit</th> <th>Delete</th> </thead> </table> <div class="clearfix"></div> <ul class="pagination pull-right"> <li class="disabled"><a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a></li> <li class="active"><a href="#">1</a></li> <li><a href="#">2</a></li> <li><a href="#">3</a></li> <li><a href="#">4</a></li> <li><a href="#">5</a></li> <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></li> </ul> </div> </div> </div> </div> <template id="order-template"> <tr> <td>{{title}}</td> <td>{{content}}</td> <td>{{created_at}}</td> <td>{{updated_at}}</td> <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button type="button" class="edit btn btn-primary btn-xs" data-toggle="modal" data-target="#dialog-edit" data-title="Edit" data-id="{{id}}"><span class="glyphicon glyphicon-pencil"></span></button></p></td> <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="delete btn btn-danger btn-xs" data-title="Delete" data-id="{{id}}"> <span class="glyphicon glyphicon-trash"></span></button></p></td> </tr> </template> <div id="dialog-edit" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Update Data</h4></div> <div class="modal-body"><form name="contactupdate" id="form-update"><div class="form-group"><label for="title">Title:</label><input type="text" class="form-control edit" placeholder="title berita" id="titleupdate"></div><div class="form-group"><label for="content">Description:</label><input type="text" class="form-control" placeholder="content berita" id="contentupdate"></div><button id="btn-update" class="btn btn-default">Submit</button> <button type="button"  class="btn btn-warning" data-dismiss="modal">Close</button></form></div></div></div></div> <div id="create" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Created Data</h4></div> <div class="modal-body"><form name="contact" id="frm"><div class="form-group"><label for="title">Title:</label><input type="text" class="form-control" placeholder="title berita" id="title"></div><div class="form-group"><label for="content">Description:</label><input type="text" class="form-control" placeholder="content berita" id="content"></div><button id="add-data" class="btn btn-default">Submit</button><button type="button"  class="btn btn-warning" data-dismiss="modal">Close</button></form></div></div></div></div> </body>', 'new-table table,[data-is="new-table"] table,new-table td,[data-is="new-table"] td,new-table th,[data-is="new-table"] th{ border: 1px solid #ddd; text-align: left; } new-table table,[data-is="new-table"] table{ border-collapse: collapse; width: 100%; } new-table th,[data-is="new-table"] th,new-table td,[data-is="new-table"] td{ padding: 10px; text-align: left; } new-table #dialog-edit,[data-is="new-table"] #dialog-edit,new-table #create,[data-is="new-table"] #create{ display: none; } new-table .ui-widget-header,[data-is="new-table"] .ui-widget-header,new-table .ui-state-default,[data-is="new-table"] .ui-state-default,new-table ui-button,[data-is="new-table"] ui-button{ background:#b9cd6d; border: 1px solid #b9cd6d; color: #FFFFFF; font-weight: bold; } new-table #btn-create,[data-is="new-table"] #btn-create{ width: 130px; margin: 10px; margin-left: 0px; }', '', function (opts) {
    var idUpdate = 0;
    var $curTr = null;
    var rootUrl = 'http://slim-api.rian.cloud/api/';

    $(function () {
        var $dialogcreate = $('#dialog-create');
        var $orders = $('#orders');
        var $title = $('#title');
        var $content = $('#content');
        var contentTemplate = $('#order-template').html();

        function addContent(data) {
            $orders.append(Mustache.render(contentTemplate, data));
        }
        
        $.ajax({
            type: 'GET',
            url: rootUrl,
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                console.log(response);
                var data = response.data.reverse();
                $.each(data, function (i, data) {
                    addContent(data);
                });
            },
            error: function () {
                alert('error loading json');
            }
        });

        $('.create').on('click', function () {
            $("#dialog-create").modal();
        });

        $('#add-data').on('click', function () {
            event.preventDefault();
            var $tr = $(this).closest('tr');
            var newData = {
                title: $title.val(),
                content: $content.val(),
            };

            $.ajax({
                type: 'POST',
                url: rootUrl,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(newData),
                success: function (content) {
                    console.log(content);
                    $("#dialog-create").modal('hide');
                    addContent(content);
                    $tr.remove();
                },
                error: function () {
                    alert('error saving data');
                }
            });

        });

        $orders.delegate('.edit', 'click', function () {
            $curTr = $(this).closest('tr');
            

            $.ajax({
                type: 'GET',
                url: rootUrl+$(this).attr('data-id'),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    // console.log(data);
                    var content = data;
                    idUpdate = content.id;
                    $("#titleupdate").val(content.title);
                    $("#contentupdate").val(content.content);
                    $("#dialog-edit").modal();
                }
            });
        });

        $('#btn-update').on('click', function () {
            event.preventDefault();
            var $tr = $(this).closest('tr');
            var newData = {
                title: $("#titleupdate").val(),
                content: $("#contentupdate").val(),
            };

            $.ajax({
                type: 'PUT',
                url: rootUrl+idUpdate,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(newData),
                success: function (content) {
                    console.log(content);
                    addContent(content);
                    $tr.remove();
                    $("#dialog-edit").modal('hide');
                                        
                },
                error: function (dataError) {
                    console.log(dataError);
                }
            });

        });

        $orders.delegate('.delete', 'click', function () {
            event.preventDefault();
            var $tr = $(this).closest('tr');
            $.ajax({
                type: 'DELETE',
                url: rootUrl+$(this).attr('data-id'),
                success: function (data) {
                    $tr.remove();
                }
            });
        });

    });

});
