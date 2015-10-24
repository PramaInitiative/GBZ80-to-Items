'use strict';

/*!
 *
 * GBZ80 to Items - script.min.js
 * Version 2.1
 * Build date : ??/??/????
 *
 * Scripté par ISSOtm
 * Tous droits réservés à ISSOtm (@ecpensiveLife) et PRAMA Initiative (@PramaTheTrust)
 *
 * Toute ou partie de ce scipt ne peut être recopié qu'avec l'autorisation expresse de ISSOtm et de PRAMA Initiative.
 * De plus, ces deux noms devront être mentionnés dans l'en-tête du script dans lequel elles se trouveront.
 *
 * Remerciements aux équipes de jQuery (http://jquery.org) et de Bootstrap (http://getbootstrap.com) pour leur fantastique travail.
 * Merci à l'auteur des Glyphicons Halflings pour avoir mis gratuitement à disposition de Boostrap certaines de ses créations.
 * Merci enfin à PRAMA Initiative pour avoir hébergé ce script !
 *
 */
/*if(navigator.appName === 'Microsoft Internet Explorer' && navigator.appVersion.match(/^4\.0/) !== null) {
    throw new Error('Les versions 5 à 8 d\'Internet Explorer ne sont plus supportées par GBZ80 to Items. Veuillez passer à une version supérieure.');
}*/

if('undefined' === typeof $) {
    if('undefined' === typeof jQuery) {
        throw new Error('jQuery est requis !!');
    } else {
        var $ = jQuery;
    }
}



// ###############
// #             #
// #  POLYFILLS  #
// #             #
// ###############
// IE8- users, be warned, as these polyfills will be abandoned as soon as this script migrates to jQuery 2.x !





// #############################
// #                           #
// #  FONCTIONS INDÉPENDANTES  #
// #                           #
// #############################

var Utilities = { // Les fonctions utilitaires qui traînaient en vrac.
    typeOf: function(a) { // Retourne le type de A. Similaire à typeof, mais retourne "array" si A est un array, "NaN" si A vaut NaN, et "null" si A vaut null.
        return typeof a === 'number' && isNaN(a) ? 'NaN' : Array.isArray(a) ? 'array' : a === null ? 'null' : typeof a;
    }, // N'utiliser que si différencier Arrays et Objects ainsi que NaNs et nulls du reste est important.
    replaceIfType: function(a, b, t) { // Retourne A si Utilities.typeOf(A) === T, ou si T est un array, si Utilities.typeOf(A) se trouve dans T ; retourne B sinon. Si T vaut undefined, Utilities.typeOf(B) est utilisé à la place.
        t = t || Utilities.typeOf(b);
        return (Utilities.typeOf(t) === 'array' ? t.indexOf(Utilities.typeOf(a)) : t === Utilities.typeOf(a)) ? a : b; // Utilities.typeOf(A) est utilisé pour éviter le remplacement d'objects par des arrays et vice-versa.
    },
    isNumber: function(n) { // Est un peu plus poussé que typeof n === 'number'.
        function _(a) {
            return typeof a === 'number' && !isNaN(a);
        }

        return _(n) || _(parseInt(n));
    },
    isInt: function(n) { // Retourne vrai si l'argument est un entier naturel.
        return Utilities.isNumber(n) && n >= 0 && Math.floor(n) === n;
    }
},



// ############################
// #                          #
// #  DÉFINITION DES OPTIONS  #
// #                          #
// ############################

options = Utilities.replaceIfType(options, {}), defaultOptions = {
    debug: false,
    useStrict: false // Actuellement inutilisé, mais ça pourra servir un jour.
}, i;
for(i in defaultOptions) { // On ajoute simplement les options si elles ne sont pas déjà présentes
    options[i] = Utilities.replaceIfType(options[i], defaultOptions[i]);
}




// ##########################
// #                        #
// #  DÉFINITION DU KERNEL  #
// #                        #
// ##########################
var Kernel = {
        debug: {
            log: function(message) {
                if(options.debug) {
                    console.log(message);
                }
            },
            info: function(message) {
                if(options.debug) {
                    console.info(message);
                }
            },
            warn: function(message) {
                if(options.debug) {
                    console.warn(message);
                }
            },
            raise: function(exception) {
                console.exception(exception);
                if(options.debug) {
                    console.log('Stack trace :');
                    console.trace();
                    console.groupEnd();
                }
                throw new Error(exception);
            },
            strictOnlyRaise: function(exception) { // Inutilisé car le mode Strict n'est pas utilisé.
                if(options.useStrict) {
                    warn('STRICT-ONLY EXCEPTION RAISED !');
                    raise(exception);
                }
            },
            group: function(title) {
                if(options.debug) {
                    console.group(title);
                }
            },
            groupEnd: function(title) {
                if(options.debug) {
                    console.groupEnd();
                }
            }
        },
        hexCharList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
        isHexListHidden: true, // La liste est cachée par défaut (classe hidden)
        animationRunning: false, // Normalement il n'y a aucune animation en cours. Enfin, je crois :D
        itemList: ['FLASH', // Liste des items. M'a fallu une semaine ! ><
        'Master Ball',
        'Hyper Ball',
        'Super Ball',
        'Pok&eacute; Ball',
        'Carte',
        'Bicyclette',
        '????? ("Planche de Surf")',
        'Safari Ball',
        'Pok&eacute;dex',
        'Pierre Lune',
        'Antidote',
        'Anti-br&ucirc;le',
        'D&eacute;gel',
        'R&eacute;veil',
        '?',
        'Gu&eacute;rison',
        'Potion Max',
        'Hyper Potion',
        'Super Potion',
        'Potion',
        'Badge Roche',
        'Badge Cascade',
        'Badge Foudre',
        'Badge Prisme',
        'Badge &Acirc;me',
        'Badge Marais',
        'Badge Volcan',
        'Badge Terre',
        'Corde Sortie',
        'Repousse',
        'Vieil Ambre',
        'Pierre Feu',
        'PierreFoudre',
        'Pierre Eau',
        'PV Plus',
        'Prot&eacute;ine',
        'Fer',
        'Carbone',
        'Calcium',
        'Super Bonbon',
        'Fossile D&ocirc;me',
        'Nautile',
        'Cl&eacute; scr&egrave;te',
        '????? (Inutilisable)',
        'Bon Commande',
        'Pr&eacute;cision +',
        'PierrePlante',
        'Carte Magn.',
        'P&eacute;pite',
        'PP Plus (inutilisable)',
        'Pok&eacute;poup&eacute;e',
        'Total Soin',
        'Rappel',
        'Rappel Max',
        'D&eacute;fense Spec.',
        'SuperRepousse',
        'Max Repousse',
        'Muscle +',
        'Jetons',
        'Eau Fra&icirc;che',
        'Soda Cool',
        'Limonade',
        'Passe Bateau',
        'Dent d\'or',
        'Attaque +',
        'D&eacute;fense +',
        'Vitesse +',
        'Sp&eacute;cial +',
        'Bo&icirc;te Jeton',
        'Colis Chen',
        'Cherc\'Objet',
        'Scope Sylph',
        'Pok&eacute;flute',
        'Cl&eacute; Asc.',
        'Multi Exp.',
        'Canne',
        'Super Canne',
        'M&eacute;ga Canne',
        'PP Plus (valide)',
        'Huile',
        'Huile Max',
        '&Eacute;lixir',
        'Max &eacute;lixir',
        '2&egrave;me SS',
        '1er SS',
        'RDC',
        '1er &eacute;tage',
        '2&egrave;me &eacute;tage',
        '3&egrave;me &eacute;tage',
        '4&egrave;me &eacute;tage',
        '5&egrave;me &eacute;tage',
        '6&egrave;me &eacute;tage',
        '7&egrave;me &eacute;tage',
        '8&egrave;me &eacute;tage',
        '9&egrave;me &eacute;tage',
        '10&egrave;me &eacute;tage',
        '4&egrave;me SS',
        'w&uuml;m\'||lm||',
        'ws*l\'||lm||',
        'v Aft||lm||',
        '&ucirc;c\' &egrave;||lm||',
        ' &ecirc;u\'c\'m\'||lm||',
        '&uuml;wj\'&eacute;||lm||',
        '||lf||lm||',
        '&ecirc;&ocirc;A ||lm||',
        '\\-g*||lm||',
        'A /',
        '&ecirc;j\'&agrave;',
        '*i l *',
        'Lg|||-',
        '\\-g*',
        '?QGn?Sl',
        'Gn?Sl',
        '?Q;MP-',
        ';MP-',
        'DHNh | T4',
        '*&ouml;****j\'*',
        '_/*-',
        '4',
        '*4&ocirc; &ecirc;*&uuml;?',
        '*8\\&ucirc;',
        '8*&ucirc;-',
        '4&ucirc; hA *',
        '89*****l\'&ecirc;Gp*|||',
        'BOULET* *A***** *&ocirc;p**',
        'BOULET********',
        '......* *||| ** ; *',
        '*',
        '**ASPICOT/',
        '4/&icirc;*4\\&icirc;y&uuml;. ... ...4*',
        '4*&icirc;*',
        'K*** ... ...*p*|||&icirc; a',
        'ECHANGE TERMINE !',
        'Dommage ! L\'&eacute;change',
        '&uacute;',
        '| eBOULET* \'*||*',
        '****pkmn***&ouml;***ASPICOT&ouml;',
        '*SG*',
        '*HG*',
        '**l\'&ecirc;o qB** ......*',
        'CENTRE TROC',
        'p\' &agrave;**&ouml;/\\* |||*METAMORPH',
        '*a&auml;/*** |||**&ouml;/',
        '8 \\',
        'ANIMATION COMBAT',
        'STYLE COMBAT',
        'RETOUR',
        '*?B4*',
        '\\*/*2p*',
        '\'*',
        '**H***pkmnH*',
        '*+H*',
        '**I*',
        '**I*',
        '* D//*\'*** ......*',
        '8',
        'APOK&eacute;DRES. * : *',
        '** p* ***C ?',
        '8',
        '\\**&agrave; ** ',
        '*',
        'p** ***Q *I3*4* h',
        '**',
        '*Q n &ocirc;4* h&acirc; ov**',
        '&ocirc;4*&icirc;8/&acirc;4*&icirc;8*&ucirc;pH*****',
        'ABCDEFHIJKLMNOPQRST',
        'ov*** * &auml;***&ouml;** a*',
        '(nom du joueur)||* ?&auml;4C 8*********',
        '*',
        '&acirc; **2*u&auml;4C *c\'vh***y\'v',
        'NOM DU RIVAL ?',
        'NOM ?',
        'SURNOM ?',
        'ps*?L \\L4/&icirc;h\\**KL *',
        '8',
        '\? *||| , ****/**D**s&auml;',
        'ps*ASPICOTL \\L4/&icirc;h\\***L *',
        '8',
        '\* *||| ,**',
        'd\'*a&auml;*** &ouml;|||** ......* * : *',
        'NOM:',
        'NOM:',
        '**',
        '*5*z\\**|||.CL*:',
        'BLUE pour Rouge, RED pour Bleu',
        'REGIS',
        'JEAN',
        'NOM :',
        'RED pour Rouge, BLUE pour Bleu',
        'SACHA',
        'PAUL',
        '',
        '*',
        '*||M\\',
        '**M\\'], // Après, on a les CS / CT. Il ne faut donc jamais utiliser cette liste seule, mais à la place utiliser la fonction item(hex).
        itemAttrList: [ // Attributs des items. à chaque fois, l'attribut "used" est réinitialisé au démarrage de la compilation et modifié pendant celle-ci.
        {used: false, valid: false, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: true},
        {used: false, valid: false, qty: false}, // Pokédex
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty:true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // Guérison
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: false, qty: false}, // Badge Roche
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: true, qty: true}, // Corde Sortie
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // PV Plus
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // Super Bonbon
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: true}, // Précision +
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: true},
        {used: false, valid: false, qty: true}, // PP Plus (invalide)
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // SuperRepousse
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: false, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: false}, // Passe bateau
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false}, // Colis Chen
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false}, // Canne
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: true}, // PP Plus
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: false, qty: false}, // 2ème SS
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // 7ème étage
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // \-g*||lm||
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // ;MP-
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // 4*î*
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // CENTRE TROC
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // RETOUR
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // 8
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // ABCDEFGHIJKLMNOPQRST
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // SURNOM ?
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // NOM:
        {used: false, valid: false, qty: false}, // NOM:
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false}, // PAUL
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: false, qty: false},
        {used: false, valid: true, qty: false}, // CS01
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: false},
        {used: false, valid: true, qty: true}, // CT01
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // CT11
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // CT21
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // CT31
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true}, // CT41
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: true, qty: true},
        {used: false, valid: false, qty: true}, // CT51
        {used: false, valid: false, qty: true},
        {used: false, valid: false, qty: true},
        {used: false, valid: false, qty: true},
        {used: false, valid: false, qty: false}],
        opcodeList: ['nop', 'ld bc, [imm<sub>16</sub>]', 'ld (bc), a', 'inc bc', 'inc b', 'dec b', 'ld b, [imm<sub>8</sub>]', 'rlca', 'ld (mem<sub>16</sub>), sp', 'add hl, bc', 'ld a, (bc)', 'dec bc', 'inc c', 'dec c', 'ld c, [imm<sub>8</sub>]', 'rrca', // Liste de tous les opcodes. Chaque ligne en contient 16.
        '&lt;corrupted stop&gt;', 'ld de, [imm<sub>16</sub>]', 'ld (de), a', 'inc de', 'inc d', 'dec d', 'ld d, [imm<sub>8</sub>]', 'rla', 'jr $+imm<sub>8</sub>', 'add hl, de', 'ld a, (de)', 'dec de', 'inc e', 'dec e', 'ld e, [imm<sub>8</sub>]', 'rra',
        'jr nz, $+imm<sub>8</sub>', 'ld hl, [imm<sub>16</sub>]', 'ldi (hl), a', 'inc hl', 'inc h', 'dec h', 'ld h, [imm<sub>8</sub>]', 'daa', 'jr z, $+imm<sub>8</sub>', 'add hl, hl', 'ldi a, (hl)', 'dec hl', 'inc l', 'dec l', 'ld l, [imm<sub>8</sub>]', 'cpl',
        'jr nc, $+imm<sub>8</sub>', 'ld sp, [imm<sub>16</sub>]', 'ldd (hl), a', 'inc sp', 'inc (hl)', 'dec (hl)', 'ld (hl), [imm<sub>8</sub>]', 'scf', 'jr c, $+imm<sub>8</sub>', 'add hl, sp', 'ldd a, (hl)', 'dec sp', 'inc a', 'dec a', 'ld a, [imm<sub>8</sub>]', 'ccf',
        'ld b, b', 'ld b, c', 'ld b, d', 'ld b, e', 'ld b, h', 'ld b, l', 'ld b, (hl)', 'ld b, a', 'ld c, b', 'ld c, c', 'ld c, d', 'ld c, e', 'ld c, h', 'ld c, l', 'ld c, (hl)', 'ld c, a',
        'ld d, b', 'ld d, c', 'ld d, d', 'ld d, e', 'ld d, h', 'ld d, l', 'ld d, (hl)', 'ld d, a', 'ld e, b', 'ld e, c', 'ld e, d', 'ld e, e', 'ld e, h', 'ld e, l', 'ld e, (hl)', 'ld e, a',
        'ld h, b', 'ld h, c', 'ld h, d', 'ld h, e', 'ld h, h', 'ld h, l', 'ld h, (hl)', 'ld h, a', 'ld l, b', 'ld l, c', 'ld l, d', 'ld l, e', 'ld l, h', 'ld l, l', 'ld l, (hl)', 'ld l, a',
        'ld (hl), b', 'ld (hl), c', 'ld (hl), d', 'ld (hl), e', 'ld (hl), h', 'ld (hl), l', 'halt', 'ld (hl), a', 'ld a, b', 'ld a, c', 'ld a, d', 'ld a, e', 'ld a, h', 'ld a, l', 'ld a, (hl)', 'ld a, a',
        'add a, b', 'add a, c', 'add a, d', 'add a, e', 'add a, h', 'add a, l', 'add a, (hl)', 'add a, a', 'adc a, b', 'adc a, c', 'adc a, d', 'adc a, e', 'adc a, h', 'adc a, l', 'adc a, (hl)', 'adc a, a',
        'sub a, b', 'sub a, c', 'sub a, d', 'sub a, e', 'sub a, h', 'sub a, l', 'sub a, (hl)', 'sub a, a', 'sbc a, b', 'sbc a, c', 'sbc a, d', 'sbc a, e', 'sbc a, h', 'sbc a, l', 'sbc a, (hl)', 'sbc a, a',
        'and b', 'and c', 'and d', 'and e', 'and h', 'and l', 'and (hl)', 'and a', 'xor b', 'xor c', 'xor d', 'xor e', 'xor h', 'xor l', 'xor (hl)', 'xor a',
        'or b', 'or c', 'or d', 'or e', 'or h', 'or l', 'or (hl)', 'or a', 'cp b', 'cp c', 'cp d', 'cp e', 'cp h', 'cp l', 'cp (hl)', 'cp a',
        'ret nz', 'pop bc', 'jp nz, mem<sub>16</sub>', 'jp mem<sub>16</sub>', 'call nz, mem<sub>16</sub>', 'push bc', 'add a, [imm<sub>8</sub>]', 'rst 00h', 'ret z', 'ret', 'jp z, mem<sub>16</sub>', 'PREFIXE', 'call z, mem<sub>16</sub>', 'call mem<sub>16</sub>','adc a, [imm<sub>8</sub>]', 'rst 08h', // Aucune instruction "PREFIXE" n'est jamais instanciée, cette entrée est là uniquement comme placeholder.
        'ret nc', 'pop de', 'jp nc, mem<sub>16</sub>', 'XXX (inexistant)', 'call nc, mem<sub>16</sub>', 'push de', 'sub a, [imm<sub>8</sub>]', 'rst 10h', 'ret c', 'reti', 'jp c, mem<sub>16</sub>', 'XXX (inexistant)', 'call c, mem<sub>16</sub>', 'XXX (inexistant)', 'sbc a, [imm<sub>8</sub>]', 'rst 18h',
        'ldh (imm<sub>8</sub>), a', 'pop hl', 'ldh (c), a', 'XXX (inexistant)', 'XXX (inexistant)', 'push hl', 'and [imm<sub>8</sub>]', 'rst 20h', 'add sp, [imm<sub>8</sub>]', 'jp (hl)', 'ld (mem<sub>16</sub>), a', 'XXX (inexistant)', 'XXX (inexistant)', 'XXX (inexistant)', 'xor [imm<sub>8</sub>]', 'rst 28h',
        'ldh a, (imm<sub>8</sub>)', 'pop af', 'XXX (inexistant)', 'di', 'XXX (inexistant)', 'push af', 'or [imm<sub>8</sub>]', 'rst 30h', 'ld hl, add sp, [imm<sub>8</sub>]', 'ld sp, hl', 'ld a, (mem<sub>16</sub>)', 'ei', 'XXX (inexistant)', 'XXX (inexistant)', 'cp [imm<sub>8</sub>]', 'rst 38h'],
        prefixedOpcodes: ['rlc b', 'rlc c', 'rlc d', 'rlc e', 'rlc h', 'rlc l', 'rlc (hl)', 'rlc a', 'rrc b', 'rrc c', 'rrc d', 'rrc e', 'rrc h', 'rrc l', 'rrc (hl)', 'rrc a', // Liste des opcodes préfixés.
        'rl b', 'rl c', 'rl d', 'rl e', 'rl h', 'rl l', 'rl (hl)', 'rl a', 'rr b', 'rr c', 'rr d', 'rr e', 'rr h', 'rr l', 'rr (hl)', 'rr a',
        'sla b', 'sla c', 'sla d', 'sla e', 'sla h', 'sla l', 'sla (hl)', 'sla a', 'sra b', 'sra c', 'sra d', 'sra e', 'sra h', 'sra l', 'sra (hl)', 'sra a',
        'swap b', 'swap c', 'swap d', 'swap e', 'swap h', 'swap l', 'swap (hl)', 'swap a', 'srl b', 'srl c', 'srl d', 'srl e', 'srl h', 'srl l', 'srl (hl)', 'srl a',
        'bit 0, b', 'bit 0, c', 'bit 0, d', 'bit 0, e', 'bit 0, h', 'bit 0, l', 'bit 0, (hl)', 'bit 0, a', 'bit 1, b', 'bit 1, c', 'bit 1, d', 'bit 1, e', 'bit 1, h', 'bit 1, l', 'bit 1, (hl)', 'bit 1, a',
        'bit 2, b', 'bit 2, c', 'bit 2, d', 'bit 2, e', 'bit 2, h', 'bit 2, l', 'bit 2, (hl)', 'bit 2, a', 'bit 3, b', 'bit 3, c', 'bit 3, d', 'bit 3, e', 'bit 3, h', 'bit 3, l', 'bit 3, (hl)', 'bit 3, a',
        'bit 4, b', 'bit 4, c', 'bit 4, d', 'bit 4, e', 'bit 4, h', 'bit 4, l', 'bit 4, (hl)', 'bit 4, a', 'bit 5, b', 'bit 5, c', 'bit 5, d', 'bit 5, e', 'bit 5, h', 'bit 5, l', 'bit 5, (hl)', 'bit 5, a',
        'bit 6, b', 'bit 6, c', 'bit 6, d', 'bit 6, e', 'bit 6, h', 'bit 6, l', 'bit 6, (hl)', 'bit 6, a', 'bit 7, b', 'bit 7, c', 'bit 7, d', 'bit 7, e', 'bit 7, h', 'bit 7, l', 'bit 7, (hl)', 'bit 7, a',
        'res 0, b', 'res 0, c', 'res 0, d', 'res 0, e', 'res 0, h', 'res 0, l', 'res 0, (hl)', 'res 0, a', 'res 1, b', 'res 1, c', 'res 1, d', 'res 1, e', 'res 1, h', 'res 1, l', 'res 1, (hl)', 'res 1, a',
        'res 2, b', 'res 2, c', 'res 2, d', 'res 2, e', 'res 2, h', 'res 2, l', 'res 2, (hl)', 'res 2, a', 'res 3, b', 'res 3, c', 'res 3, d', 'res 3, e', 'res 3, h', 'res 3, l', 'res 3, (hl)', 'res 3, a',
        'res 4, b', 'res 4, c', 'res 4, d', 'res 4, e', 'res 4, h', 'res 4, l', 'res 4, (hl)', 'res 4, a', 'res 5, b', 'res 5, c', 'res 5, d', 'res 5, e', 'res 5, h', 'res 5, l', 'res 5, (hl)', 'res 5, a',
        'res 6, b', 'res 6, c', 'res 6, d', 'res 6, e', 'res 6, h', 'res 6, l', 'res 6, (hl)', 'res 6, a', 'res 7, b', 'res 7, c', 'res 7, d', 'res 7, e', 'res 7, h', 'res 7, l', 'res 7, (hl)', 'res 7, a',
        'set 0, b', 'set 0, c', 'set 0, d', 'set 0, e', 'set 0, h', 'set 0, l', 'set 0, (hl)', 'set 0, a', 'set 1, b', 'set 1, c', 'set 1, d', 'set 1, e', 'set 1, h', 'set 1, l', 'set 1, (hl)', 'set 1, a',
        'set 2, b', 'set 2, c', 'set 2, d', 'set 2, e', 'set 2, h', 'set 2, l', 'set 2, (hl)', 'set 2, a', 'set 3, b', 'set 3, c', 'set 3, d', 'set 3, e', 'set 3, h', 'set 3, l', 'set 3, (hl)', 'set 3, a',
        'set 4, b', 'set 4, c', 'set 4, d', 'set 4, e', 'set 4, h', 'set 4, l', 'set 4, (hl)', 'set 4, a', 'set 5, b', 'set 5, c', 'set 5, d', 'set 5, e', 'set 5, h', 'set 5, l', 'set 5, (hl)', 'set 5, a',
        'set 6, b', 'set 6, c', 'set 6, d', 'set 6, e', 'set 6, h', 'set 6, l', 'set 6, (hl)', 'set 6, a', 'set 7, b', 'set 7, c', 'set 7, d', 'set 7, e', 'set 7, h', 'set 7, l', 'set 7, (hl)', 'set 7, a'],
        args: [0, 2, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 1, 0, // Nombre d'octets d'argument par instruction
        0, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        1, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        1, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 2, 2, 2, 0, 1, 0, 0, 0, 2, 0, 2, 2, 1, 0,
        0, 0, 2, 0, 2, 0, 1, 0, 0, 0, 2, 0, 2, 0, 1, 0,
        1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0, 1, 0,
        1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0, 1, 0]
    }, instructions = new InstructionList(); // On instancie la liste d'instructions.


Kernel.debug.group('Chargement en cours...');
Kernel.debug.info('Le kernel a été chargé.');



// ######################################
// #                                    #
// #  FONCTIONS DE CONVERSION DE BASES  #
// #                                    #
// ######################################

function decToHex(input, minChars) { // Tansforme un nombre en son équivalent hexadécimal. On peut spécifier un nombre minimal de caractères, pour forcer par exemple un format "à l'octet' : ld a, $01
    if(!Utilities.isInt(input)) { // On veut convertir un nombre !
        Kernel.debug.raise('input : Nombre attendu, ' + input + ' obtenu.');
    }
    minChars = minChars || 1; // On attend au moins un chiffre par défaut.
    if(!Utilities.isInt(minChars)) { // Si minChars n'est pas un entier, ça va pas.
        Kernel.debug.raise('minChars : Nombre attendu, ' + minChars + ' obtenu.');
    }
    var valeur = ''; // La valeur retour est d'abord vide.
    while(input !== 0) { // Tant que l'input n'est pas nulle...
        valeur = Kernel.hexCharList[input % 16] + valeur; // On ajoute un signe hexadécimal en fonction du premier nybble de l'input.
        input = Math.floor(input / 16); // On divise l'input par 16, puis on arrondit pour passer au nybble suivant.
        minChars--; // On a généré un chiffre, ça fait un de moins à bourrer.
    }
    if(valeur.length <= minChars) { // On bourre de zéros pour remplir le nombre minimum de caractères demandé.
        valeur = '0'.repeat(minChars) + valeur;
    }
    return valeur;
}

function hexToDec(input) { // Convertit un nombre hexadécimal (sous forme de chaîne de caractères) en nombre décimal.
    if(typeof input !== 'string') { // On attend une chaîne de caractères.
        Kernel.debug.raise('input : String expected.');
    }
    if(!/^[0-9A-F]+$/.test(input)) { // On teste si la chaîne correspond à un nombre hexadécimal.
        Kernel.debug.raise('input : heaxdecimal parsing failed.');
    }
    var valeur = 0;
    while(input !== '') {
        valeur = valeur * 16 + Kernel.hexCharList.indexOf(input.charAt(0)); // On ajoute le nybble suivant.
        input = input.slice(1); // On a parsé un caractère.
    }
    return valeur;
}

function binToDec(input) { // Convertit un nombre binaire (sous forme de chaîne de caractères) en nombre décimal.
    if(typeof input !== 'string') { // On attend une chaîne de caractères.
        Kernel.debug.raise('input : String expected.');
    }
    var valeur = 0;
    while(input !== '') {
        valeur *= 2; // On passe au bit suivant.
        if(input.charAt(0) === '1') { // Si c'est un "1", on incrémente.
            valeur++;
        } else if(input.charAt(0) !== '0') { // Sinon, on devrait avoir un "0".
            Kernel.debug.raise('input : binary parsing failed.'); // Sinon la chaîne n'est pas valide.
        }
        input = input.slice(1); // On a parsé un bit.
    }
    return valeur;
}

Kernel.debug.info('Fonctions de conversion de bases chargées !');



// ##############################
// #                            #
// #  CONSTRUCTEURS DE CLASSES  #
// #                            #
// ##############################

// Simple instruction. Sans utilité en-dehors d'une InstructionList.
function Instruction(instructionStr, arg) { // Paramètres : l'instruction sous forme texte ('ldi (hl), a'), et l'argument éventuel.
    Kernel.debug.group('Instanciation d\'une Instruction');
    Kernel.debug.log('Une Instruction a été instanciée.');

    this.instrIndex = Kernel.opcodeList.indexOf(instructionStr); // Récupération de l'index de l'instruction dans la table, ce qui équivaut à récupérer son opcode.
    this.isPrefix = false; // Par défaut, l'instruction n'est pas préfixée.
    this.argument = 0;
    this.args = 0;

    if(this.instrIndex === -1) { // L'instruction est-elle dans la table principale ?
        this.instrIndex = Kernel.prefixedOpcodes.indexOf(instructionStr); // Non. Est-elle dans la table des instructions préfixées ?
        if(this.instrIndex === -1) { // Non :D
            Kernel.debug.raise('Instruction inexistante : ' + instructionStr); // Termine aussi l'instanciation.
        }
        this.isPrefix = true; // L'instruction est préfixée.
    } else {
        this.args = Kernel.args[this.instrIndex]; // On récupère le nombre d'arguments via la table d'arguments.
        this.argument = arg; // On passe "aveuglément" l'argument. Le code lisant cette valeur devra vérifier la valeur de this.args !
    }
    if(this.args !== 0 && !Utilities.isInt(this.argument)) { // L'argument doit (uniquement s'il existe) être un nombre.
        throw new Error('Argument invalide');
    }

    this.hex = (this.isPrefix ? 'CB ' : '') + decToHex(this.instrIndex, 2) + (this.args === 0 ? '' : ' ' + (this.args === 1 ? decToHex(this.argument, 2) : decToHex(this.argument, 4).slice(2) + ' ' + decToHex(this.argument, 4).slice(0, 2)));

    this.str = instructionStr;
    if(this.args !== 0) { // S'il y a un argument à remplacer, (note : modifie RegExp.$2)
        Kernel.debug.log('Argument détecté, modification de la chaîne.');
        this.str = instructionStr.replace(/\[?(im|me)m<sub>(8|16)<\/sub>\]?/, '$' + decToHex(arg, this.args * 2)); // On conserve l'instruction originale, mais on y modifie le paramètre.
    }


    var a = '', b = {}; // a n'est utilisé que pour for in, b servira d'argument à Object.defineProperties()
    for(a in this) { // Pour chaque option de cet objet, on l'ajoute à b.
        b[a] = {writable: false}; // Le format est celui utilisé par Object.defineProperties().
    }
    Object.defineProperties(this, b); // Cela permet de prévenir la réécriture des propriétés de cet objet, sauf via les méthodes dudit objet.


    if(options.debug) { // Code de débug additionnel, permet de donner plus d'infos sur chaque instance créée.
        b = {instruction: this.str, prefixee: this.isPrefix, opcode: this.hex, tailleArgument: this.args, argument: decToHex(this.argument)} // Un résumé des caractéristiques de l'instance.
        console.table(b);
        console.warn('L\'instance va être validée.');
        for(a in b) {
            b[a] = false;
        }
        if(Utilities.typeOf(this.argument) !== 'number' || this.argument < 0) {
            b.argument = true; // L'argument est invalide.
        } else {
            b.argument = (function(t){
                switch(t.args) {
                    case 0:
                        return t.argument !== 0;
                    case 1:
                        return t.argument > 255;
                    case 2:
                        return t.argument > 65536;
                    default:
                        b.tailleArgument = true;
                        return true;
                }
            })(this);
        }
        a = false;
        for(var arg in b) {
            a = a || b[a];
        }
        if(a) {
            console.error('La validation de l\'instance a échoué.');
            console.info('Elements invalides :');
            console.table(b);
            console.log('Stack Trace :');
            console.trace();
        }
    }
    Kernel.debug.log('L\'instanciation s\'est déroulée correctement !');
    Kernel.debug.groupEnd();
}

// Liste d'instructions. Elle n'est instanciée qu'une seule fois, mais au moins on a plein de méthodes utiles.
function InstructionList() { // Pas d'arguments.
    Kernel.debug.group('Instanciation d\'une InstructionList');
    Kernel.debug.log('Une InstructionList a été instanciée.');

    this.list = []; // La liste d'instructions proprement dite. Tout le reste est là pour clarifier le code.


    // FONCTIONS DE MANAGING

    this.push = function(instr) { // Une extension de la méthode push de this.list, à laquelle une vérification a été ajoutée pour ne permettre que l'ajout d'objets Instructions.
    // Malgré tout, on peut toujours accéder à la méthode push de this.list elle-même.
        if(instr instanceof Instruction) { // Filtrer les ajouts d'autre chose qu'une Instruction.
            Kernel.debug.log('Instruction ajoutée en index ' + this.list.push(instr));
        } else {
            Kernel.debug.raise('Instruction attendue, ' + instr + ' obtenu.');
        }
        updaterListe(); // Toutes les fonctions de managing mettent la liste à jour d'elles-même.
    };

    // Les fonctions de managing prennent en argument l'ID de l'Instruction ciblée.
    this.remove = function(ID) { // Retire un argument de la liste.
        if(!Utilities.isInt(ID)) { // On veut un nombre !
            Kernel.debug.raise('Nombre attendu, ' + ID + ' obtenu.');
        }
        Kernel.debug.log('L\'instruction #' + ID + ' a été retirée de la liste.');
        this.list.splice(ID, 1); // J'avais lu que cette méthode est peu utilisée. Ici elle a beaucoup servi !
        updaterListe();
    };

    this.moveDownwards = function(ID) { // Intervertit deux items, celui d'id ID et celui d'id ID + 1.
        if(!Utilities.isInt(ID)) { // On veut un nombre !
            Kernel.debug.raise('Nombre attendu, ' + ID + ' obtenu.');
        }
        if(ID >= this.list.length) { // Un petit bounds check.
            Kernel.debug.raise('Cannot move instruction out of bounds !');
        }
        Kernel.debug.log('Items #' + ID + ' et #' + (ID+1) + ' intervertis.');
        this.list.splice(ID, 2, this.list[ID + 1], this.list[ID]);
        updaterListe();
    };

    this.moveUpwards = function(ID) { // Intervertit deux items, celui d'id ID - 1 et celui d'id ID.
        if(ID < 1) { // Seulement un bounds check spécifique à cette fonction-ci. Si ID n'est pas un nombre, ce test sera passé, mais this.moveDownwards le bloquera.
            Kernel.debug.raise('Cannot move instruction out of bounds !');
        }
        this.moveDownwards(ID - 1); // La possibilité que ID ne soit pas un nombre est handlée par this.moveDownwards !
    };

    this.flush = function() { // Un reset des instructions.
        this.list.splice(0, a.length); // this.list = [] ne fonctionne pas, puisque elle est mise en lecture seule une fois l'objet instancié.
        // Au passage, c'est donc une faille du système, puisqu'ainsi on peut vider la liste même de l'extérieur. Enfin...
        Kernel.debug.log('Liste d\'instructions vidée.');
        updaterListe();
    };


    this.forEach = function(func) { // Exporte la méthode forEach de this.list.
        if(typeof func !== 'function') {
            Kernel.debug.raise('Fonction attendue, ' + func + ' obtenu.');
        }
        this.list.forEach(func);
    };

    this.opcodify = function() { // Retourne les octets correspondant aux instructions sous forme de tableau de chaînes hexadécimales.
        var o = []; // La liste d'opcodes.
        this.forEach(function(current) { // Pour chaque instruction,
            o += ' ' + current.hex; // on ajoute son opcode à la liste. On ne se met pas sous forme de tableau tout de suite.
        });
        return o.slice(1).split(' '); // On vire le premier espace qui ne sert à rien, et on sépare tous les octets.
    }


    this.isLengthNull = function() { // Exporte la méthode length de this.list.
        return this.list.length === 0;
    }

    var a = '', b = {}; // Voir le code identique sur Instruction() pour les commentaires.
    for(a in this) {
        b[a] = {writable: false};
    }
    Object.defineProperties(this, b);


    Kernel.debug.log('L\'instanciation s\'est déroulée correctement !');
    Kernel.debug.groupEnd();
}

Kernel.debug.info('Constructeurs de classe chargés !');



// ###########################
// #                         #
// #  FONCTIONS UTILITAIRES  #
// #                         #
// ###########################

function item(ID, hex) { // Retourne l'item d'IDH ID, et s'il est invalide et que hex vaut true, renvoie "hex:[IDH] ([nom de l'item])".
    if(!Utilities.isInt(ID)) {
        Kernel.debug.raise('ID : Nombre attendu, ' + ID + ' reçu.');
    }
    if(typeof hex !== 'boolean') {
        Kernel.debug.raise('hex : Boolean attendu, ' + ID + ' reçu.');
    }
    return ID < 196 ? (hex && !Kernel.itemAttrList[ID].valid ? 'hex:' + decToHex(ID, 2) + ' (' + Kernel.itemList[ID] + ')' : Kernel.itemList[ID]) : (ID < 201 ? 'CS0' + (ID - 195) : ID === 255 ? 'RETOUR' : 'CT' + (ID < 210 ? '0' : '') + (ID - 200));
}


function updaterListe() { // Met à jour la liste d'instructions.
    Kernel.debug.group('Mise à jour de la liste');
    Kernel.debug.log('Mise à jour de la liste d\'instructions.');
    $('#instrList span.glyphicon').off('click'); // On va virer tous les glyphicon, mais je préfère virer les interactions avant. On sait jamais.
    if(instructions.isLengthNull()) { // S'il n'y a aucune instruction,
        Kernel.debug.log('Liste vide !');
        $('#instrList').html('<li>Il n\'y a aucune instruction.</li>'); // On met "aucune instruction" pour éviter de laisser une liste vide.
        return;
    }
    $('#instrList').html(''); // On réinitialise la liste d'items.
    instructions.forEach(function(current, i) { // Pour chaque instruction,
        $('#instrList').append('<li class="row" data-index="' + i + '"><span class="col-xs-2"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="glyphicon glyphicon-upload" aria-hidden="true"></span><span class="glyphicon glyphicon-download" aria-hidden="true"></span></span><span class="col-xs-5">' + current.str + '</span><span class="col-xs-3">' + current.hex + '</span></span></li>'); // On ajoute un élément de liste contenant l'instruction sous forme texte puis hexadécimale.
    });
    // Activation des boutons
    $('#instrList .glyphicon-trash').click(function() { // Destruction de l'instruction.
        instructions.remove(parseInt($(this).parent().parent().attr('data-index')));
    });
    $('#instrList .glyphicon-download').click(function() { // Déplacement vers le bas.
        instructions.moveDownwards(parseInt($(this).parent().parent().attr('data-index')));
    });
    $('#instrList .glyphicon-upload').click(function() { // Déplacement vers le haut.
        instructions.moveUpwards(parseInt($(this).parent().parent().attr('data-index')));
    });
    $('#instrList .glyphicon-upload:first').off('click').remove(); // On retire l'option "Remonter" de la première instruction.
    $('#instrList .glyphicon-download:last').off('click').remove(); // On retire l'option "Dexcendre" de la dernière instruction.
    Kernel.debug.log('Liste mise à jour avec succès !');
    Kernel.debug.groupEnd();
}


function ajouterInstruction() { // Ajouter une instruction, première partie.
    Kernel.debug.group('Ajout d\'une instruction');
    Kernel.debug.log('Ajout d\'une instruction, partie 1.');
    var instr = $('#buttonBars .active').html().toLowerCase(), opcode = Kernel.opcodeList.indexOf(instr); // On récupère l'instruction choisie, et la valeur de l'opcode.
    if(instr === undefined) { // Aucun bouton n'a été sélectionné.
        Kernel.debug.warn('Aucune instruction n\'a été sélectionnée, ajout annulé.');
        return false; // Equivaut à event.preventDefault(), mais on n'a pas l'object event ici.
    }
    instr = instr.toLowerCase();
    $('#ajouter .buttonbars .btn-group').hide('fade'); // On cache les barres de boutons.
    $('#ajouter').modal('hide'); // On demande la fermeture du modal. Le traitement se poursuit pendant qu'il se ferme.
    if(Kernel.prefixedOpcodes.indexOf(instr) !== -1) { // Si l'instruction est préfixée,
        Kernel.debug.log('Instruction préfixée, handler spécial activé.');
        instructions.push(new Instruction(instr, 0)); // On l'instancie tout de suite pour permettre au reste du système de fonctionner sans encombre.
    } else {
        $('#nbArgs').attr('data-instr', instr); // On doit mémoriser quelle instruction est demandée pour la seconde partie.
        if(Kernel.args[opcode] !== 0) { // S'il y a des arguments,
            Kernel.debug.log('Demande d\'arguments activée.');
            $('#nbArgs').modal('show'); // On affiche le modal de demande d'arguments.
            $('#operation').html(instr); // On dit de quelle instruction on veut l'argument.
        } else { // Sinon,
            Kernel.debug.log('Aucun argument n\'est requis.');
            _ajouterInstruction(); // On appelle la seconde partie de l'ajout directement, elle gèrera la non-existence d'un argument toute seule.
        }
    }
}

function _ajouterInstruction() {
    function erreur(message) { // En cas d'erreur, on l'affiche.
        Kernel.debug.warn('Entrée invalide ! ("' + message + '")');
        $('#nbArgs .form-group').addClass('has-feedback').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span><span class="sr-only">invalide !</span>');
        $('#nbArgs .help-block').html(message).show('fade');

        setTimeout(function() {
            $('#nbArgs .form-group').removeClass('has-error').removeClass('has-feedback');
            $('#nbArgs .form-group > span').remove();
            $('#nbArgs .help-block').hide('fade');
        }, 5000);
    }

    Kernel.debug.log('Ajout d\'une instruction, partie 2.');
    var nbArgs = Kernel.args[Kernel.opcodeList.indexOf($('#nbArgs').attr('data-instr'))], arg = 65536, argType = 'dec', // On récupère le nombre d'octets de l'argument, et on initialise les variables d'arguments aux valeurs par défaut.
        funcs = {dec: function(input){return parseInt(input);}, bin: binToDec, hex: hexToDec}; // La liste des fonctions de conversion chaîne -> nombre en fonction de la base.
    if(nbArgs !== 0) { // S'il y a au moins un octet d'argument,
        Kernel.debug.log('Argument requis.');
        argType = $('#nbArgs select').val(); // On récupère la base dans laquelle il a été entré,
        arg = $('#nbArgs input').val(); // Et sa valeur.
        var regex = {dec: /^[0-9]+$/, bin: /^[01]+$/, hex: /^[0-9A-F]+$/}; // Les regex pour parser les nombres dans chacune des bases (binaire, décimale ou héxadécimale).

        Kernel.debug.log('Argument : ' + arg + ', de type ' + argType);
        if(regex[argType].test(arg)) { // On tente de parser la chaîne en accord avec sa base.
            arg = funcs[argType](arg); // On a réussi, on récupère donc l'argument qu'on convertit en accord avec sa base. Puisque le parsing a réussi, ce sera forcément un entier positif.
            if(arg > (nbArgs === 1 ? 255 : 65535)) { // On vérifie que l'argument n'est pas trop grand.
                erreur('L\'argument entr&eacute; est trop grand !');
                return;
            }
        } else {
            arg = {dec: 'd&eacute;cimal', bin : 'binaire', hex: 'hexad&eacute;cimal'}; // Seulement un stockage temporaire, puisque arg ne sera plus utilisé.
            erreur('L\'argument entr&eacute; n\'est pas un nombre ' + arg[argType] + ' valide !');
            return;
        }
    }
    Kernel.debug.log('Instruction validée, ajout en cours...');
    $('#nbArgs').modal('hide'); // Terminé, on peut cacher le modal.
    instructions.push(new Instruction($('#nbArgs').attr('data-instr'), arg)); // On ajoute l'instruction à la liste.
    Kernel.debug.groupEnd();
}

function toutSupprimer() { // Cette instruction vide la liste.
    Kernel.debug.group('Purge de la liste');
    Kernel.debug.warn('La liste va être vidée !');
    instructions.flush(); // Cela déclenche aussi la mise à jour de la liste.
    $('#toutSupprimer .togglable').toggle('fade'); // De l'animation, pour faire joli.
    $('#toutSupprimer .modal-mapCo').removeClass('bg-danger').addClass('bg-success');
    $('#toutSupprimer h4').removeClass('text-danger').addClass('text-success');
    $('#toutSupprimer').modal('handleUpdate'); // Voir la documentation de Bootstrap : http://getbootstrap.com/javascript#modal
    setTimeout(function() {
        $('#toutSupprimer').modal('hide');
        setTimeout(function() {
            $('#toutSupprimer .togglable').toggle('fade'); // On remet à jour le modal.
            $('#toutSupprimer .modal-mapCo').removeClass('bg-success').addClass('bg-danger');
            $('#toutSupprimer h4').removeClass('text-success').addClass('text-danger');
        }, 200);
        Kernel.debug.log('Modal de vidage fermé.');
        Kernel.debug.groupEnd();
    }, 3000);
}



// ##############################
// #                            #
// #  FONCTIONS DE COMPILATION  #
// #                            #
// ##############################

function itemify(opcodes, w) { // Écrit chaque item correspondant à un tableau d'opcodes dans l'emplacement prévu à cet effet, et retourne les warnings rencontrés. N'utiliser qu'en conjonction avec opcodifiy().
    Kernel.debug.group('Itemification');
    Kernel.debug.log('"Itemification" démarrée.');
    if(Utilities.typeOf(opcodes) !== 'array') { // On cherche un array.
        Kernel.debug.raise('opcodes : Array attendu, ' + opcodes + ' obtenu.');
    }
    if(Utilities.typeOf(w) !== 'object') { // w doit être un tableau d'options.
        Kernel.debug.raise('w : Object attendu, ' + w + ' obtenu.');
    }
    $('#items > ol').html(''); // On vide la liste d'items.
    var i = 0, l = opcodes.length, warnings = {multiple: false, invalid: false, quantity: false}; // On initialise un peu de tout...
    Kernel.itemAttrList.forEach(function(current) { // On réinitialise toutes les instructions marquées comme "utilisées".
        current.used = false;
    });
    Kernel.debug.log('Setup terminé, démarrage de l\'"itemification".');
    while(i < l) { // On n'utilise pas forEach() puisqu'on modifie l'index pendant un tour de boucle.
        warnings.multiple = warnings.multiple || Kernel.itemAttrList[hexToDec(opcodes[i])].used; // Si l'instruction a déjà été utilisée, on active l'avertissement "multiple".
        Kernel.itemAttrList[hexToDec(opcodes[i])].used = true; // On marque l'instruction comme utilisée.
        warnings.invalid = warnings.invalid || !Kernel.itemAttrList[hexToDec(opcodes[i])].valid; // Si l'item n'est pas valide, on active l'avertissement "invalid".
        $('#items > ol').append('<li>' + item(hexToDec(opcodes[i]), true) + ' x</li>'); // On ajoute un item à la liste.
        if(!Kernel.itemAttrList[hexToDec(opcodes[i])].qty && i + 1 !== l && opcodes[i] !== 1) { // Si l'item n'admet pas de quantité et que celle-ci ne peut pas être égale à 1, on active l'avertissement "quantity".
            warnings.quantity = true;
        }
        i++; // On passe à l'opcode suivant, qui sera la quantité.
        $('#items > ol > li:last').append(typeof opcodes[i] !== 'string' ? '[quantit&eacute; quelconque]' : hexToDec(opcodes[i])); // Si ledit opcode n'existe pas, on affiche "quantité quelconque" à la place.
        i++; // On passe à l'opcode (et à l'item) suivant.
    }
    Kernel.debug.log('"Itemification" terminée, mise en place des warnings...');
    for(i in warnings) {
        warnings[i] = warnings[i] && w[i]; // On n'active les avertissements que s'ils étaient autorisés.
    }
    Kernel.debug.log('Mise en place des warnings terminée.');
    Kernel.debug.groupEnd();
    return warnings;
}

function compilProgress(percent, str) { // Modifie la barre de progression au pourcentage précisé.
    $('#compiler div.progress-bar').html(percent + '%').css('width', percent + '%').attr('aria-valuenow', percent);
    $('#action').html(str);
    Kernel.debug.log('Progression de la compilation : ' + str + ' (' + percent + '%).');
}

function compiler() { // Le gros morceau ! ...même si le plus gros est en ligne ~1200
    Kernel.debug.group('Compilation');
    Kernel.debug.log('Démarrage de la compilation.');
    if(instructions.isLengthNull()) { // Cette fonction étant déclanchée à l'appui sur un bouton,
        Kernel.debug.warn('Aucune instruction à compiler, la compilation a été annulée.');
        return false; // S'il n'y a aucune instruction à compiler, ne rien faire.
    }

    $('#items').hide('fade'); // On efface l'ancien résultat compilé.
    $('#items > .alert-warning').hide('fade');
    $('#items > .alert-warning > ol > li').hide('fade');
    $('#compiler').modal('show'); // On commence à montrer le modal, le reste du script devrait démarrer dans quelques secondes.
    // Le code exécuté ensuite est vers la ligne 1200
    compilProgress(0, 'Pr&eacute;paration'); // Cette instruction devrait s'exécuter avant qu'il ne soit complètement montré et que le reste du script n'ait démarré. Donc bon.
}




// ################################
// #                              #
// #  FONCTION LIÉE A LA SIDEBAR  #
// #                              #
// ################################

function toggleHexList() { // Toggle instantané pour les petits écrans.
    Kernel.debug.group('Animation de la sidebar');
    Kernel.debug.log('Animation de la sidebar...');
    if(Kernel.animationRunning) { // Voir les commentaires de toggleHexList()
        Kernel.debug.warn('Une animation est déjà en cours, ne spammez pas le bouton !');
        return false;
    }
    if(Kernel.isHexListHidden) {
        $('.sidebar').switchClass('hidden', 'col-sm-4');
        $('.main, .footer > .container-fluid > div').switchClass('col-sm-12', 'col-sm-8 col-sm-offset-4');
    } else {
        $('.main, .footer > .container-fluid > div').switchClass('col-sm-8 col-sm-offset-4', 'col-sm-12');
        $('.sidebar').switchClass('col-sm-4', 'hidden');
    }
    Kernel.isHexListHidden = !Kernel.isHexListHidden;
    $('#navbar button').text((Kernel.isHexListHidden ? 'Afficher' : 'Cacher') + ' la HEX liste');
    Kernel.debug.log('Animation terminée.');
    Kernel.debug.groupEnd();
}

Kernel.debug.info('Toutes les fonctions ont été chargées.');



// #####################
// #                   #
// #  INITIALISATIONS  #
// #                   #
// #####################

$(document).ready(function() { // Une fois que le DOM est chargé,
    Kernel.debug.info('Le DOM est chargé.');

    toggleHexList(); // On affiche la HEX liste, qui est cachée par défaut.

    $('#ajouter ul a').click(function() { // Quand on clique sur une des options des dropdowns,
        $('#buttonBars button').removeClass('active'); // On vire le bouton précédemment activé,
        $('#buttonBars > .btn-group').hide('fade'); // On cache tous les boutons (en cachant les groupes de boutons),
        $('#' + $(this).attr('data-toolbar')).show('fade'); // On affiche le groupe qui vient d'être sélectionné,
        Kernel.debug.log('buttonBar #' + $(this).attr('data-toolbar') + ' affichée.'); // Et on le logue.
    });

    $('#ajouter').on('show.bs.modal', function() { // A la fermeture du modal, cacher la barre de boutons visible
        Kernel.debug.log('buttonBar cachée.');
        $('#buttonBars > .btn-group').hide('fade');
    });

    // Pour le snippet de code qui suit,
    // Je sais que Bootstrap a une fonctionnalité similaire (http://getbootstrap.com/javascript/#buttons-checkbox-radio), mais elle ne fonctionne que .btn-group par .btn-group . Dans ce cas, il faudrait malgré tout remettre à zéro les boutons de autres toolbars... Bref, ça rendrait le code encore plus compliqué.
    $('#buttonBars button').click(function() { // Clic sur un des boutons-poussoirs des barres de boutons.
        Kernel.debug.log('Bouton ' + $(this).text() + ' poussé.');
        if (!$(this).hasClass('active')) { // Si le bouton cliqué n'était pas déjà le bouton actif,
            $('#buttonBars button').removeClass('active'); // On désactive le bouton déjà poussé pour n'avoir qu'un seul bouton actif au maximum.
        }
        $(this).toggleClass('active'); // On toggleClass pour un effet "bouton-poussoir"
    });

    $('#formWarn button').on('click', function() { // L'autre série de boutons-poussoirs.
        $(this).toggleClass('btn-danger').toggleClass('btn-success').toggleClass('active');
    });

    $('.well .row .btn-group-justified > .btn-group').on('shown.bs.dropdown', function() { // Certains dropdowns sont trop longs et dépassent de l'écran. Dans ce cas, il faut handleUpdate pour éviter que la barre de défilement ne modifie la position du modal.
        $('#ajouter').modal('handleUpdate');
    }).on('hidden.bs.dropdown', function() {
        $('#ajouter').modal('handleUpdate');
    });

    $('#items button').click(function() { // Donne au bouton de fermeture sa fonctionnalité. Je n'utilise pas la fonctionnalité par défaut de Bootstrap, puisqu'elle détruit la bulle d'alerte au lieu de la cacher.
        $('#items').hide('fade');
    });

    $('#nbArgs form').on('submit', function(e) { // Taper "Entrée" dans le modal de demande d'argument n'envoie pas le formulaire, mais exécute la seconde partie de l'ajout à la place.
        e.preventDefault();
        _ajouterInstruction();
    });

    $('.navbar-right .navbar-btn').click(toggleHexList);

    // Event de la compilation
    $('#compiler').on('shown.bs.modal', function() { // Une fois que le modal sera totalement montré,
        compilProgress(25, 'Conversion'); // On n'a pas fait le quart du travail, mais on a passé une étape sur 4.
        var opcodes = instructions.opcodify(); // On compile les instructions.
        setTimeout(function() { // Apparemment (je pense, à cause des transitions CSS), les navigateurs font planter le JS si on modifie la barre de progression à intervalles de temps trop rapprochés.
            compilProgress(50, 'Mise en forme');
            var warnings = itemify(opcodes, {multiple: $('#_multipleWarn').hasClass('active'), invalid: $('#_invalidWarn').hasClass('active'), quantity: $('#_quantityWarn').hasClass('active')}); // Met à jour la liste d'items, et renvoie les warnings déclenchés.
            setTimeout(function() { // Encore un délai...
                compilProgress(75, 'Finition');
                for(var i in warnings) { // On scanne la liste des warnings.
                    if(warnings[i]) { // Si un warning est déclenché,
                        $('#' + i + 'Warn').removeClass('hidden'); // On l'affiche,
                        $('#items > .alert-warning').removeClass('hidden'); // Ainsi que l'élément racine.
                    } // Ils seront "fadés" en même temps que la liste d'instructions.
                }
                $('#items').show('fade'); // La compilation est terminée, parfait !
                setTimeout(function() { // Quasiment fini...
                    compilProgress(100, 'Termin&eacute; !');
                    setTimeout(function() { // Promis, c'est le dernier !
                        $('#compiler').modal('hide');
                        Kernel.debug.groupEnd();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    });
    
    $('.alert-success').hide().removeClass('hidden'); // Cacher la liste d'opcodes de façon "display: none" au lieu de la classe "hidden"
});

Kernel.debug.info('Le script est totalement chargé et initialisé. Bonne utilisation !');
Kernel.debug.groupEnd();


/*!
Si tu comprends ce code, tu auras le droit de manger un bonbon !
___    .-"""-.    ___
\  \  /\ \ \ \\  /  /
 }  \/\ \ \ \ \\/  {
 }  /\ \ \ \ \ /\  {
/__/  \ \ \ \ /  \__\
       '-...-'
*/
