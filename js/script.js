var e = elementID => document.getElementById(elementID)
var ii = e('input'),
gmoutput = e('lipsum'),
mtcc = e('tm-chars-count'),
mtwc = e('tm-words-count'),
gncc = e('gn-chars-count'),
gnwc = e('gn-words-count'),
tmts = e('TMstatus'),
gngs = e('GNstatus'),
gw = '',
gt = 0
localStorageStuff()

// count input's chars and words and displays it
function counters(el){
  let txar = '', ctrscc = '', ctrswc = '', e = 0, a = 0
  if (el == 'input') {
    txar = ii.value
    ctrscc = mtcc
    ctrswc = mtwc
  }
  if (el == 'lipsum') {
    txar = gmoutput.value
    ctrscc = gncc
    ctrswc = gnwc
  }

  input = {
    chars: function(){
      return txar.length
    },
    words: function(){
      if (txar.match(/\S/g)) {
        //Arabic words
        let pta = /[\u0600-\u06FF]+/g
        if (pta.test(txar)) { a = txar.match(pta).length }
        //English words
        let pte = /\w+/g
        if (pte.test(txar)) { e = txar.match(pte).length }

        return e + a
      } else { return 0 }
    }
  }
  ctrscc.innerHTML = input.chars()
  ctrswc.innerHTML = input.words()
}

function clearInputs(){
  for (i = 0; i < arguments.length; i++) {
    let n = arguments[i]
    e(n).value = ''
  }
}

function zeroCounters(t){
  if (t == 'TM') {
    mtcc.innerHTML = 0
    mtwc.innerHTML = 0
  }
  if (t == 'GN') {
    gncc.innerHTML = 0
    gnwc.innerHTML = 0
  }
}

function updateStatus(el, msg, color) {
  if (el == 'TM') {
    tmts.innerHTML = msg
    tmts.style.color = color
  }
  if (el == 'GN') {
    gngs.innerHTML = msg
    gngs.style.color = color
  }
}

// coply to clipboard
function copyFrom(el) {
  let t = ''
  if (el == 'input') { t = 'TM' }
  if (el == 'lipsum') { t = 'GN' }
  if (e(el).value) {
    let selector = document.querySelector('#' + el)
    selector.select()
    try {
      let successful = document.execCommand('copy')
      if (successful) {
        updateStatus(t,'Copied to clipboard','#3399ff')
      } else {
        updateStatus(t,'Unable to copy!','#ff4d4d')
      }
    } catch (err) {
      console.log('Error! unable to copy')
    }
  } else {
    updateStatus(t,'There\'s nothing to copy','#ff4d4d')
  }
}

// switch cases using built-in bootstrap 4.0 classes
// c must be either 0,1, or 2 only
// 0 = lowercase, 1= uppercase, 2= capitalize
function switchCase(c){
  let iic = ii.classList,
  l = ['text-lowercase','text-uppercase','text-capitalize'],
  n = ['lowercase','UPPERCASE','Capitalize Case']
  for (let i = 0; i < l.length; i++) {
    if (i != c) iic.remove(l[i])
  }
  iic.add(l[c])
  updateStatus('TM', n[c] + ' applied','#3399ff')
}

function countMatchings(){
  if(ii.value){
    let ma = e('match').value
    if(ma){
      let f = ii.value.split(ma).length - 1
      updateStatus('TM','Found <b>' + f + '</b> matching(s)', 'orange')
    } else { updateStatus('TM','What would you like to count?','#ff4d4d') }
  } else { updateStatus('TM','No text to count','#ff4d4d') }
}

function replaceSomething(){
  let iiv = ii.value
  if(iiv){
    let rt = e('replace-this').value,
    wt = e('with-this').value
    if(rt && wt){
      let replaced = iiv.split(rt).join(wt)
      ii.value = replaced
      let rp = iiv.split(rt).length - 1
      counters('input')
      updateStatus('TM','Found and replaced <b>' + rp + '</b> time(s)', 'orange')
    } else { updateStatus('TM','What would you like to replace?','#ff4d4d') }
  } else { updateStatus('TM','No text to replace','#ff4d4d') }
}

// expect an array of strings to be removed from e('input').value
function removeSomething() {
  let iiv = ii.value
  if(iiv){
    let a = arguments, f = 0
    if(a[0].length > 0){
      for (let i = 0; i < a.length; i++) {
        let inp = a[i]
        f += iiv.split(inp).length - 1
        ii.value = ii.value.split(inp).join('')
        counters('input')
      }
      updateStatus('TM','Found and removed <b>' + f + '</b> time(s)', 'orange')
    } else { updateStatus('TM','What would you like to remove?','#ff4d4d') }
  } else { updateStatus('TM','No text to remove from','#ff4d4d') }
}

// 'idList' should be an ARRAY of HTML IDs that we want
// to remove the 'className' from them
// 'aaIto' is a HTML ID to assign the 'className' to afterwards
function classStripper(idList, className, aaIto){
  let l = idList
  for (let i = 0; i < l.length; i++) {
    e(l[i]).classList.remove(className)
  }
  if (aaIto) { e(aaIto).classList.add(className) }
}

function localStore(k, v) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(k, v)
  }
}

// clumpsy attempt to generate scrambled text
function scramble(type) {
  input = ii.value
  if (input) {
    switch(type) {
      case 'sentences':
      c = doReplace(' ,', ', ', shuffle(input.split(', ')).join(', '))
      d = doReplace('.', '. ', shuffle(c.split('.')).join('.'))
      ii.value = doReplace('  ', ' ', d)
      updateStatus('TM','Sentence scrambled done', 'orange')
      break;

      case 'words':
      n = input.split(' ')
      w = shuffle(n).join(' ')
      ii.value = w
      updateStatus('TM','Words scrambled done', 'orange')
      break;

      case 'letters':
      n = input.split(' ')
      for (i = 0; i < n.length; i++) {
        n[i] = shuffle(n[i].split('')).join('')
      }
      ii.value = n.join(' ')
      updateStatus('TM','Letters scrambled done', 'orange')
      break;

      default:
    }
  } else {
    updateStatus('TM','No text to scramble','#ff4d4d')
  }
}

// Fisher–Yates shuffle https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let m = array.length,
  t, i
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--)
    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

// expects 3 strings, 1st= what to replace, 2nd= with what, 3rd= in what
function doReplace(str1, str2, str3){
  return str3.split(str1).join(str2)
}

function randomBetween(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min)
}

function generateLipsum() {
  let what = document.querySelector('input[name="genwhat"]:checked').value,
  howmany = document.querySelector('input[name="gentimes"]:checked').value

  if (what && howmany) {
    let grandList = "lorem ipsum dolor amet consectetur adipiscing a elit sed do eiusmod tempor incid iduntlabo no redo lore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisiali quip excommodo consequat duis aute in irur erepreh enderit voluptate velit esse cillume eu fugiat nulla pariatur excepteur sint el occaecat cupidatat non proident suntcul paofficia deserunt mollit if animest laborum sedpe rspiciatis unde omnis istenatus a voluptatem accusanti umemque no laudantium totam rem aperiam or eaque ipsa no quae ab el illo inventore el veritat isquasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia volup tasasp el ernatur aut odit aut fugit sed quia consequ untur magnies eosratione voluptatem sequi nesciunt ut neque et porro el sit quisquam estdolo rem is ipsum quiaamet consectetur adipisci velit sed quia non numquam eius modi tempora incid untlabore dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam quis nostrum exercita tionem a ullam corporis suscipit laboriosam nisial iquid no excommodi el consequatur quis autem vel a eum iure repre a hender itinid voluptate velit el esse quam nihil molestiae consequatur vel illumdo lorem eum fugiat quo voluptas nulla pariatur at vero eosac cusamusiusto qui odio el dignissimos ducimu blanditiis praesen tium voluptatum no deleniti atque corrupti quosesquas moles tias excepturi sint occaecati cupiditate non provident ae similique suntculpaof ficia a deserunt mollitia animiest laboru mdolorum fuga et harum quidem a rerum facilis estexpedita distinctio el nam libero tempore cum soluta nobis est eligen di optio cumque nihil impedit quo minusquod maxime placeat facere possimus omnis voluptas assumenda est omnis repellendus temporibus autem quibu sdamaut officiis debitis no aut rerum necessitatibus saepe evenietet el voluptates repudiandae sint el molestiae a no recusandae itaque earum rerum hic no tenetur a sapiente delec tusaut reiciendis volupt atibus maiores alias consequatur aut perferendi sibus asperiores repellat".split(' ')

    let caps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    let generate = {
      words : function(n){
        let r = [], g = []
        for (let i = 0; i < n; i++) {
          r.push(randomBetween(0,grandList.length))
        }
        for (let i = 0; i < n; i++) {
          let rw = grandList[r[i]]
          // Capitalize first letter of first word only
          if (i == 0) {
            rw = caps[randomBetween(0,25)] + rw
          }
          g.push(rw)
        }
        return g.join(' ')
      },
      sentcs : function(n){
        let s =[]
        for (let i = 0; i < n; i++) {
          let slg = generate.words(randomBetween(4,10))
          if (i != 0) {
            slg = slg.toLowerCase()
          }
          // randomly end a sentence with a comma, or with a dot then a Capital letter
          let separateBy = function(){
            let r = randomBetween(0,1),
            sprt = ''
            if (r) {
              sprt = ', '
            } else {
              sprt = '. ' + caps[randomBetween(0,25)]
            }
            return sprt
          }
          let sepBy = ''
          // if its the last sentence then ends it with a dot only
          if (i == n-1) {
            sepBy = '.'
          } else { sepBy = separateBy() }
          s.push(slg + sepBy )
        }
        return s.join('')
      },
      prgfs : function(n){
        let p =[]
        for (let i = 0; i < n; i++) {
          let plg = generate.sentcs(randomBetween(10,15))
          p.push(plg)
        }
        return p.join('\n\n')
      }
    }

    if (what == 'words') {
      gmoutput.value = generate.words(howmany) + '.'
      updateStatus('GN','Words generated','green')
    }
    if (what == 'sentcs') {
      gmoutput.value = generate.sentcs(howmany)
      updateStatus('GN','Sentences generated','green')
    }
    if (what == 'prgfs') {
      gmoutput.value = generate.prgfs(howmany)
      updateStatus('GN','Paragraphs generated','green')
    }

    let lv = e('lipsum')
    gncc.innerHTML = lv.value.length
    gnwc.innerHTML = lv.value.match(/\w+/g).length

  } else {
    updateStatus('GN','Select what to generate and how many times','red')
  }
}

// local storage stuff
function localStorageStuff() {
  if (typeof(Storage) !== "undefined") {

    let at = localStorage.textmani_active_tab,
    gw = localStorage.textmani_gen_what,
    gt = localStorage.textmani_gen_times

    if (at) {
      classStripper(['manipulator','generator'],'active',at)
      classStripper(['manipulator-content','generator-content'],'active',at+'-content')
    } else {
      e('manipulator').classList.add('active')
      e('manipulator-content').classList.add('active')
    }
    if (gw) {
      e(gw).click()
      classStripper(['words','sentcs','prgfs'],'active',gw)
    }
    if (gt) {
      e(gt).click()
      classStripper(['t1','t3','t5','t10','t20','t50','t100','t250','t500'],'active',gt)
    }
  } else {
    // Sorry! No Web Storage support..
  }
}
