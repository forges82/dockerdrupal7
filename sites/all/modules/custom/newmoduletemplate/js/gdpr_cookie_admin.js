(function ($) {
  Drupal.behaviors.gdpr_cookie_admin = {
    attach: function(context, settings) {
      $('body').each(function() {
        try {
          // Si no tiene el navegador las cookies activadas, termina
          if (!Drupal.gdpr_cookie_admin.cookiesEnabled()) {
            return;
          }

          // Devuelve si ha aceptado o no las cookies
          var status = Drupal.gdpr_cookie_admin.getCurrentStatus();

          /* Datos de las configuraciones de drupal
          var clicking_confirms = Drupal.settings.gdpr_cookie_admin.popup_clicking_confirmation;
          var agreed_enabled = Drupal.settings.gdpr_cookie_admin.popup_agreed_enabled;
          var popup_hide_agreed = Drupal.settings.gdpr_cookie_admin.popup_hide_agreed; */

          // si no están aceptadas el uso de cookies
          if (status == 0) {
              Drupal.gdpr_cookie_admin.showPopup();

            /*
            // Si hacen click, es como si aceptaran. (AHORA NO ES ASÍ)
            if (clicking_confirms) {
              $('a, input[type=submit]').bind('click.gdpr_cookie_admin', function(){
                if(!agreed_enabled) {
                  Drupal.gdpr_cookie_admin.setStatus(1);
                  next_status = 2;
                }
                Drupal.gdpr_cookie_admin.changeStatus(next_status);
              });
            } */

            $('.save-preferences').click(function(){
                Drupal.gdpr_cookie_admin.setStatusCheckbox();
                Drupal.gdpr_cookie_admin.hidePopup();
            });

            $('.agree-button').click(function(){
              Drupal.gdpr_cookie_admin.setStatusAll(1);
              Drupal.gdpr_cookie_admin.hidePopup();
            });

              $('.disagree-button').click(function(){
                  Drupal.gdpr_cookie_admin.setStatusAll(0);
                  Drupal.gdpr_cookie_admin.hidePopup();
              });
          }
          // si están aceptadas el uso de cookies
          else if(status == 1) {
            Drupal.gdpr_cookie_admin.hidePopup();
            // crea el popup con el HTML creado mediante Drupal
            /*
            Drupal.gdpr_cookie_admin.createPopup(Drupal.settings.gdpr_cookie_admin.popup_html_agreed);
            if (popup_hide_agreed) {
              $('a, input[type=submit]').bind('click.gdpr_cookie_admin_hideagreed', function(){
                Drupal.gdpr_cookie_admin.changeStatus(2);
              });
            }
            */


          } else {
            return;
          }
        }
        catch(e) {
          return;
        }
      });
    }
  }

  Drupal.gdpr_cookie_admin = {};


  /**
   * Devuelve si ha aceptado o no las cookies
   */
  Drupal.gdpr_cookie_admin.getCurrentStatus = function() {
	todas = false;
    terminos = Drupal.settings.gdpr_cookie_admin.gdpr_cookie_admin_terms;
    for (var i = 0; i < terminos.length; i+=1) {
        name = 'gdpr_allow_'+terminos[i];
        if(!Drupal.gdpr_cookie_admin.getCookie(name)) {
            return false;
        }
        else {
          if(Drupal.gdpr_cookie_admin.getCookie(name) == 1) {
            todas = true;
          }
        }
    }
    if(!todas) {
      return false;
    }
    return true;
  }


  /**
   * Define un estado de la cookie cookie-agreed
   */
  Drupal.gdpr_cookie_admin.setStatusAll = function(status) {
    terminos = Drupal.settings.gdpr_cookie_admin.gdpr_cookie_admin_terms;
    for (var i = 0; i < terminos.length; i+=1) {
        Drupal.gdpr_cookie_admin.setStatus(terminos[i],status);
    }
  }

  Drupal.gdpr_cookie_admin.setStatusCheckbox = function() {
      terminos = Drupal.settings.gdpr_cookie_admin.gdpr_cookie_admin_terms;
      for (var i = 0; i < terminos.length; i+=1) {
          if($('input[name=_gdpr_cookie_admin_term_'+terminos[i]+']:checked').length >= 1) {
              Drupal.gdpr_cookie_admin.setStatus(terminos[i], 1);
          }
          else {
              Drupal.gdpr_cookie_admin.setStatus(terminos[i], 0);
          }
      }
  }


  Drupal.gdpr_cookie_admin.setStatus = function(item, status) {
    var date = new Date();
    date.setDate(date.getDate() + 100);
    var cookie = "gdpr_allow_"+item+"=" + status + ";expires=" + date.toUTCString() + ";path=" + Drupal.settings.basePath;
    document.cookie = cookie;
  }


  /**
   * Devuelve si está de acuerdo o no con las cookies
   */
  Drupal.gdpr_cookie_admin.hasAgreed = function() {
    var status = Drupal.gdpr_cookie_admin.getCurrentStatus();
    if(status == 1 || status == 2) {
      return true;
    }
    return false;
  }


  /**
   * Verbatim copy of Drupal.comment.getCookie().
   */
  Drupal.gdpr_cookie_admin.getCookie = function(name) {
    var search = name + '=';
    var returnValue = '';

    if (document.cookie.length > 0) {
      offset = document.cookie.indexOf(search);
      if (offset != -1) {
        offset += search.length;
        var end = document.cookie.indexOf(';', offset);
        if (end == -1) {
          end = document.cookie.length;
        }
        returnValue = decodeURIComponent(document.cookie.substring(offset, end).replace(/\+/g, '%20'));
      }
    }

    return returnValue;
  };


  /**
   * Comprueba si el navegador tiene gestión de cookies activada
   */
  Drupal.gdpr_cookie_admin.cookiesEnabled = function() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
      document.cookie="testcookie";
      cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
  }

  Drupal.gdpr_cookie_admin.hidePopup = function() {
    $('#gdpr_cookie_admin_popup').hide("slow");
  }
  Drupal.gdpr_cookie_admin.showPopup = function() {
    $('#gdpr_cookie_admin_popup').show("slow");
  }
  
})(jQuery);