$(document).ready(function () {
    $('#categoriesTable').DataTable({
        dom:
            "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        buttons: [
            {
                text: 'Ekle',
                attr: {
                    id: "btnAdd",
                },
                className: 'btn btn-success',
                action: function (e, dt, node, config) {

                }
            },
            {
                text: 'Yenile',
                className: 'btn btn-warning',
                action: function (e, dt, node, config) {
                    $.ajax({
                        type: 'GET',
                        url: '/Admin/Category/GetAllCategories/',
                        contentType: "application/json",
                        beforeSend: function () {
                            $('#categoriesTable').hide();
                            $('.spinner-border').show();
                        },
                        success: function (data) {
                            const categoryListDto = jQuery.parseJSON(data);
                            console.log(categoryListDto);
                            if (categoryListDto.ResultStatus === 0) {
                                let tableBody = "";
                                $.each(categoryListDto.Categories.$values,
                                    function (index, category) {
                                        tableBody += `
                                          <tr>
                                <td>${category.Id}</td>
                                <td>${category.Name}</td>
                                <td>${category.Description}</td>
                                <td>${convertFirstLettertoUpperCase(category.IsActive.toString())}</td>
                                <td>${convertFirstLettertoUpperCase(category.IsDeleted.toString())}</td>   
                                <td>${category.Note}</td>
                                <td>${convertToShortDate(category.CreatedDate)}</td>
                                <td>${category.CreatedByName}</td>
                                <td>${convertToShortDate(category.ModifiedDate)}</td>
                                <td>${category.ModifiedByName}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm btn-block btn-update" data-id="${category.Id}"><span class="fas fa-edit"></span></button>
                                    <button class="btn btn-danger btn-sm btn-block btn-delete" data-id="${category.Id}"><span class="fas fa-minus-circle"></span></button>
                                </td>
                                </tr>`
                                    });
                                $('#categoriesTable > tbody').replaceWith(tableBody);
                                $('.spinner-border').hide();
                                $('#categoriesTable').fadeIn(1400);
                            }
                            else {
                                toastr.error(`${categoryListDto.Message}`, 'İşlem Başarısız!');
                            }
                        },
                        error: function (err) {
                            console.log(err);
                            $('.spinner-border').hide();
                            $('#categoriesTable').fadeIn(1000);
                            toastr.error(`${err.responseText}`, 'İşlem Başarısız!');
                        }
                    });
                }
            }
        ],
        language: {
            "emptyTable": "Tabloda herhangi bir veri mevcut değil",
            "info": "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
            "infoEmpty": "Kayıt yok",
            "infoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
            "infoThousands": ".",
            "lengthMenu": "Sayfada _MENU_ kayıt göster",
            "loadingRecords": "Yükleniyor...",
            "processing": "İşleniyor...",
            "search": "Ara:",
            "zeroRecords": "Eşleşen kayıt bulunamadı",
            "paginate": {
                "first": "İlk",
                "last": "Son",
                "next": "Sonraki",
                "previous": "Önceki"
            },
            "aria": {
                "sortAscending": ": artan sütun sıralamasını aktifleştir",
                "sortDescending": ": azalan sütun sıralamasını aktifleştir"
            },
            "select": {
                "rows": {
                    "_": "%d kayıt seçildi",
                    "1": "1 kayıt seçildi"
                },
                "cells": {
                    "1": "1 hücre seçildi",
                    "_": "%d hücre seçildi"
                },
                "columns": {
                    "1": "1 sütun seçildi",
                    "_": "%d sütun seçildi"
                }
            }

        }
    });
    /* Datatables ends here */
    /* Ajax GET / Getting the _CategoryAddPartial as Modal Form starts from here */
    $(function () {
        const url = '/Admin/Category/Add/';
        const placeHolderDiv = $('#modelPlaceHolder');
        $('#btnAdd').click(function () {
            $.get(url).done(function (data) {
                placeHolderDiv.html(data);
                placeHolderDiv.find(".modal").modal('show');
            });
        });
        /* Ajax GET / Getting the _CategoryAddPartial as Modal Form ends from here */
        /* Ajax POST / posting the FromData as CategoryDto starts from here */
        placeHolderDiv.on('click', '#btnSave', function (event) {
            event.preventDefault();
            const form = $('#form-category-add');
            const actionUrl = form.attr('action');
            const dataToSend = form.serialize();
            $.post(actionUrl, dataToSend).done(function (data) {
                console.log(data);
                const categoryAddAjaxModel = jQuery.parseJSON(data);
                console.log(categoryAddAjaxModel);
                const newFormBody = $('.modal-body', categoryAddAjaxModel.CategoryAddPartial);
                placeHolderDiv.find('.modal-body').replaceWith(newFormBody);
                const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';
                if (isValid) {
                    placeHolderDiv.find('.modal').modal('hide');
                    const newTableRow = `
                    
                            <tr>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Id}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Name}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Description}</td>
                                <td>${convertFirstLettertoUpperCase(categoryAddAjaxModel.CategoryDto.Category.IsActive.toString())}</td>
                                <td>${convertFirstLettertoUpperCase(categoryAddAjaxModel.CategoryDto.Category.IsDeleted.toString())}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Note}</td>
                                <td>${convertToShortDate(categoryAddAjaxModel.CategoryDto.Category.CreatedDate)}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.CreatedByName}</td>
                                <td>${convertToShortDate(categoryAddAjaxModel.CategoryDto.Category.ModifiedDate)}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.ModifiedByName}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm btn-block btn-update" data-id="${categoryAddAjaxModel.CategoryDto.Category.Id}" ><span class="fas fa-edit"></span></button>
                                    <button class="btn btn-danger btn-sm btn-block btn-delete" data-id="${categoryAddAjaxModel.CategoryDto.Category.Id}"><span class="fas fa-minus-circle"></span></button>
                                </td>
                            </tr>               
                            `
                    const newTableRowObject = $(newTableRow);
                    newTableRowObject.hide();
                    $('#categoriesTable').append(newTableRowObject);
                    newTableRowObject.fadeIn(3500);
                    toastr.success(`${categoryAddAjaxModel.CategoryDto.Message}`, 'Başarılı İşlem! ');

                }
                else {
                    let summaryText = "";
                    $('#validation-summary > ul > li').each(function () {
                        let text = $(this).text();
                        summaryText = `*${text}\n`;
                    });
                    toastr.warning(summaryText);
                }
            });
        });
    });
    $(document).on('click', '.btn-delete', function (event) {
        event.preventDefault();
        const id = $(this).attr('data-id');
        const tableRow = $(`[name="${id}"]`);
        const categoryName = tableRow.find('td:eq(1)').text();
        Swal.fire({
            title: 'Silmek istediğinize emin misiniz?',
            text: `${categoryName} adlı kategori silinecektir`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, Silcem!',
            cancelButtonText: 'Hayır, Silmicem!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: { categoryId: id },
                    url: '/Admin/Category/Delete/',
                    success: function (data) {
                        const categoryDto = jQuery.parseJSON(data);
                        if (categoryDto.ResultStatus === 0) {
                            Swal.fire(
                                'Silindi!',
                                `${categoryDto.Category.Name} adlı kategori silinmiştir`,
                                'success'
                            );

                            tableRow.fadeOut(3500);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Bir hata oluştu ...',
                                text: `${categoryDto.Message}`,

                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        toastr.error(`${err.responseText}`, "Hata!");
                    }

                });
            }
        });
    });
    $(function () {
        const url = '/Admin/Category/Update/';
        const placeHolderDiv = $('#modalPlaceHolder');
        $(document).on('click', '.btn-update', function (event) {
 ;           event.preventDefault();
            const id = $(this).attr('data-id');
            $.get(url, { categoryId: id }).done(function (data) {
                placeHolderDiv.html(data);
                placeHolderDiv.find('.modal').modal('show');
            }).fail(function () {
                toastr.error("Bir Hata Oluştu");
                    
            });
        });
        placeHolderDiv.on('click', '#btnUpdate', function (event) {
            event.preventDefault();
            const form = $('#form-category-update');
            const actionUrl = form.attr('action');
            const dataToSend = form.serialize();
            $.post(actionUrl, dataToSend).done(function (data) {
                const categoryUpdateAjaxModel = jQuery.parseJSON(data);
                console.log(categoryUpdateAjaxModel);

            }).fail(function (response) {
                console.log(response);
            });
        });
    });
});
