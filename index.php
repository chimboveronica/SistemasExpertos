
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title>SistemasExpertos</title>
        <link rel="shortcut icon" href="http://www.ecu911.gob.ec/wp-content/themes/institucion/favicon.ico" type="image/x-icon">
        <link href="bootstrap/bootstrap.css" rel="stylesheet">
        <link href="bootstrap/bootstrap-responsive.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="css/demo.css">
        <script type="text/javascript" src="js/requerid/functions.js"></script>
        <script>!window.jQuery && document.write(unescape('%3Cscript src="js/jquery-1.11.2.min.js"%3E%3C/script%3E'))</script>
        <script type="text/javascript" src="mespeak.js"></script>
        <script type="text/javascript">

        </script>
    </head>
    <body>
        <div style="border: 2px solid white;">
            <span id="iniLogo"> </span>
        </div>
        <nav>
            <ul class="breadcrumb">
                <li><a href="http://unl.edu.ec/" class="tooltip-2">Información 
                        <span> 
                            <img src="img/ff1.PNG"/> 

                        </span> 
                    </a></li>
                    <li><a href="https://github.com/chimboveronica/SistemasExpertos" class="tooltip-2">Codigo Fuente 
                        <span> 
                            <img src="img/link.png"/> 

                        </span> 
                    </a></li>

            </ul>
         
        </nav>

        <header>            
            <img src="img/Robot-inteligente-650x300.jpg" alt="Sistemas Expertos" width="650" height="900"/>
        </header>        
        <iframe id="hiddenFrame" style="display:none;"></iframe>
        <script language="javascript">
        </script>
        <form id="login" name="frm_Datos" class="form-horizontal" action = "index.php" method = "post">
            <h1>CONSULTAS</h1>
            <fieldset id="inputs">
                <input id="username" name = "us" type="text" placeholder="Escribe una pregunta" onclick="index.php"  autofocus required>   

            </fieldset>
            <fieldset id="actions">
                <button id="submit" class = "btn btn-success" type="submit"  >Preguntar</button>
                  <img src="img/42538742812932705713.gif"  width="200" />
               
            </fieldset>
            
            <fieldset>
                <div class="geolocalizacion">                
                    <input name = "latitud" type="text" id="latitud">
                    <input name = "longitud" type="text" id="longitud">
                </div>
            </fieldset>
        </form><br><br><br><br><br><br><br><br>
 <img src="img/a1.PNG"  width="100%" height="15"/>
        <?php

        if (isset($_POST['us']) && isset($_POST['latitud']) && isset($_POST['longitud'])) {
            $us = $_POST['us'];
            $latitud = $_POST['latitud'];
            $longitud = $_POST['longitud'];
            $text = str_replace(' ', '', $us);
            $textConsulta=strtolower ($text);
            $cmd = "preguntar($textConsulta)";
            $output1 = `swipl -s prolog.pl -g "$cmd" halt.`;
            
            $output = '
           <html>
          <title>' . $us . '</title>
        
        <body>
                            <link rel="stylesheet" type="text/css" href="css/demo.css">
                            <div align="center" width="500" height="500" ><p> <h3><a ><span id="feedback"></span></a></h3> </p></div>
                            
                            <script language="javascript" >
                               
            meSpeak.loadConfig("mespeak_config.json");
            meSpeak.loadVoice("voices/es.json");

            function loadVoice(id) {
                var fname = "voices/" + id + ".json";
                meSpeak.loadVoice(fname, voiceLoaded);
            }

            function voiceLoaded(success, message) {
                if (success) {
                    alert("Voice loaded: " + message + ".");
                }
                else {
                    alert("Failed to load a voice: " + message);
                }
            }

            /*
             auto-speak glue:
             additional functions for generating a link and parsing any url-params provided for auto-speak
             */

            var formFields = ["text", "amplitude", "wordgap", "pitch", "speed"];

            function autoSpeak() {
                // checks url for speech params, sets and plays them, if found.
                // also adds eventListeners to update a link with those params using current values
                var i, l, n, params, pairs, pair,
                        speakNow = null,
                        useDefaultVoice = true,
                        q = document.location.search,
                        f = document.getElementById("speakData"),
                        s1 = document.getElementById("variantSelect"),
                        s2 = document.getElementById("voiceSelect");
              
                if (!f || !s2)
                    return; // form and/or select not found
                if (q.length > 1) {
                    // parse url-params
                    params = {};
                    pairs = q.substring(1).split("&");
                    for (i = 0, l = pairs.length; i < l; i++) {
                        pair = pairs[i].split("=");
                        if (pair.length == 2)
                            params[pair[0]] = decodeURIComponent(pair[1]);
                    }
                    // insert params into the form or complete them from defaults in form
                    for (i = 0, l = formFields.length; i < l; i++) {
                        n = formFields[i];
                        if (params[n]) {
                            f.elements[n].value = params[n];
                        }
                        else {
                            params[n] = f.elements[n].value;
                        }
                    }
                    if (params.variant) {
                        for (i = 0, l = s1.options.length; i < l; i++) {
                            if (s1.options[i].value == params.variant) {
                                s1.selectedIndex = i;
                                break;
                            }
                        }
                    }
                    else {
                        params.variant = "whisperf";
                    }
                    // compile a function to speak with given params for later use
                    // play only, if param "auto" is set to "true" or "1"
                    if (params.auto == "true" || params.auto == "1") {
                        speakNow = function () {
                            meSpeak.speak(params.text, {
                                amplitude: params.amplitude,
                                wordgap: params.wordgap,
                                pitch: params.pitch,
                                speed: params.speed,
                                variant: params.variant

                            });
                        };
                    }
                    // check for any voice specified by the params (other than the default)
                    if (params.voice && params.voice != s2.options[s2.selectedIndex].value) {
                        // search selected voice in selector
                        for (i = 0, l = s2.options.length; i < l; i++) {
                            if (s2.options[i].value == params.voice) {
                                // voice found: adjust the form, load voice-data and provide a callback to speak
                                s2.selectedIndex = i;
                                meSpeak.loadVoice("voices/" + params.voice + ".json", function (success, message) {
                                    if (success) {
                                        if (speakNow)
                                            speakNow();
                                    }
                                    else {
                                        if (window.console)
                                            console.log("Failed to load requested voice: " + message);
                                    }
                                });
                                useDefaultVoice = false;
                                break;
                            }
                        }
                    }
                    // standard voice: speak (deferred until config is loaded)
                    if (speakNow && useDefaultVoice)
                        speakNow();
                }
                // initial url-processing done, add eventListeners for updating the link
                for (i = 0, l = formFields.length; i < l; i++) {
                    f.elements[formFields[i]].addEventListener("change", updateSpeakLink, false);
                }
                s1.addEventListener("change", updateSpeakLink, false);
                s2.addEventListener("change", updateSpeakLink, false);
                // finally, inject a link with current values into the page
                updateSpeakLink();
            }

            function updateSpeakLink() {
                // injects a link for auto-execution using current values into the page
                var i, l, n, f, s, v, url, el, params = new Array();
                // collect values from form
                f = document.getElementById("speakData");
                for (i = 0, l = formFields.length; i < l; i++) {
                    n = formFields[i];
                    params.push(n + "=" + encodeURIComponent(f.elements[n].value));
                }
                // get variant
                s = document.getElementById("variantSelect");
                if (s.selectedIndex >= 0)
                    params.push("variant=" + s.options[s.selectedIndex].value);
                // get current voice, default to "en/en" as a last resort
                s = document.getElementById("voiceSelect");
                if (s.selectedIndex >= 0)
                    v = s.options[s.selectedIndex].value;
                if (!v)
                    v = meSpeak.getDefaultVoice() || "en/en";
                params.push("voice=" + encodeURIComponent(v));
                params.push("auto=true");
                // assemble the url and add it as GET-link to the page
                url = "?" + params.join("&");
                url = url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
                el = document.getElementById("linkdisplay");
                if (el)
                    el.innerHTML = "Instant Link: <a href=" + url + ">Speak this</a>.";
            }

            // trigger auto-speak at DOMContentLoaded
            if (document.addEventListener)
                document.addEventListener("DOMContentLoaded", autoSpeak, false);

            /*
             end of auto-speak glue
             */

                            console.log("' . "Fuera del sistema" . '");
                            document.frm_Datos.us.focus();
                            var feedbackTag = parent.document.getElementById("feedback");
                            
                            
                            meSpeak.speak("' . $output1 . '")
                            feedbackTag.innerHTML = "' . $output1 . '";


</script>
       
        <form style="visibility:hidden" id="speakData" 
              onsubmit="meSpeak.speak(text.value, {amplitude: 100, wordgap: 0, pitch: 50, speed: 175, variant: variant.options[variant.selectedIndex].value});
                return false">
            <p><strong>Text:</strong> <input type="text" name="text" size=80 value="Never gonna give, you, up." />
                <input type="submit" value="Go!"/>
                <input type="button" value="Stop" onclick="meSpeak.stop();
                        return true;" /></p>
            <p style="visibility:hidden"><strong style="visibility:hidden">Options:</strong>
                Amplitude: <input type="text" name="amplitude" size=5 value="100" style="visibility:hidden"/>
                Pitch: <input type="text" name="pitch" size=5 value="50" style="visibility:hidden"/>
                Speed: <input type="text" name="speed" size=5 value="175" style="visibility:hidden"/>
                Word gap: <input type="text" name="wordgap" size=5 value="0" style="visibility:hidden" />
                Variant: <select name="variant" id="variantSelect" style="visibility:hidden">
                    <option value="whisperf">whisperf (female)</option>
                    <option value="f1">f1 (female 1)</option>
                    <option value="f2">f2 (female 2)</option>
                    <option value="f3">f3 (female 3)</option>
                    <option value="f4">f4 (female 4)</option>
                    <option value="f5">f5 (female 5)</option>
                    <option value="m1">m1 (male 1)</option>
                    <option value="m2">m2 (male 2)</option>
                    <option value="m3">m3 (male 3)</option>
                    <option value="m4">m4 (male 4)</option>
                    <option value="m5">m5 (male 5)</option>
                    <option value="m6">m6 (male 6)</option>
                    <option value="m7">m7 (male 7)</option>
                    <option value="croak">croak</option>
                    <option value="klatt">klatt</option>
                    <option value="klatt2">klatt2</option>
                    <option value="klatt3">klatt3</option>
                    <option value="whisper">whisper</option>
                    <option value="whisperf">whisperf (female)</option>
                </select></p>
        </form>
        <form onsubmit="return false" style="visibility:hidden">
            <p><strong>Voice:</strong> <select id="voiceSelect"  onchange="loadVoice(this.options[this.selectedIndex].value);">
                    <option value="ca">ca - Catalan</option>
                    <option value="cs">cs - Czech</option>
                    <option value="de">de - German</option>
                    <option value="el">el - Greek</option>
                    <option value="en/en" selected="selected">en - English</option>
                    <option value="en/en-n">en-n - English, regional</option>
                    <option value="en/en-rp">en-rp - English, regional</option>
                    <option value="en/en-sc">en-sc - English, Scottish</option>
                    <option value="en/en-us">en-us - English, US</option>
                    <option value="en/en-wm">en-wm - English, regional</option>
                    <option value="eo">eo - Esperanto</option>
                    <option value="es">es - Spanish</option>
                    <option value="es-la">es-la - Spanish, Latin America</option>
                    <option value="fi">fi - Finnish</option>
                    <option value="fr">fr - French</option>
                    <option value="hu">hu - Hungarian</option>
                    <option value="it">it - Italian</option>
                    <option value="kn">kn - Kannada</option>
                    <option value="la">la - Latin</option>
                    <option value="lv">lv - Latvian</option>
                    <option value="nl">nl - Dutch</option>
                    <option value="pl">pl - Polish</option>
                    <option value="pt">pt - Portuguese, Brazil</option>
                    <option value="pt-pt">pt-pt - Portuguese, European</option>
                    <option value="ro">ro - Romanian</option>
                    <option value="sk">sk - Slovak</option>
                    <option value="sv">sv - Swedish</option>
                    <option value="tr">tr - Turkish</option>
                    <option value="zh">zh - Mandarin Chinese (Pinyin)</option>
                    <option value="zh-yue">zh-yue - Cantonese Chinese</option>
                </select></p>
        </form>
                            </body></html>';
            echo $output;
            exit;
        }
        ?>
       
          
    </body>
</html>