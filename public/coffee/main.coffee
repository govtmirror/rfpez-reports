typeahead_searching = false

$("#add-collaborator-form input[name=username]").typeahead
  minLength: 3
  source: (query, process) ->
    clearTimeout(typeahead_searching)

    typeahead_searching = setTimeout ->
      $.ajax
        url: "/users/typeahead"
        data:
          query: query
        success: (data) ->
          return process(data)
    , 200

$(document).on "submit", "#add-collaborator-form", (e) ->
  e.preventDefault()
  input = $(this).find("input[name=username]")
  button = $(this).find("button")
  button.button('loading')
  $(this).ajaxSubmit
    success: (data) ->
      button.button('reset')

      if data.status is "success"
        $(".collaborators-table tbody").append("<tr><td>#{input.val()}</td></tr>")
        input.val('')
      else if data.status is "error"
        button.flash_button_message("danger", data.message)