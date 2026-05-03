// (C) http://walter.bislins.ch/doku/ControlPanel

var xClass2Type={};(function(){var types="Boolean Number String Function Array Date RegExp Object Error".split(" ");var len=types.length;for(var i=0;i<len;i++){var name=types[i];xClass2Type["[object "+name+"]"]=name.toLowerCase();}})();function xType(obj){if(obj==null)return obj+"";return typeof obj==="object"||typeof obj==="function"?xClass2Type[Object.prototype.toString.call(obj)]||"object":typeof obj;}
function xDef(x){return(typeof(x)!=='undefined');}
function xAny(x){return(typeof(x)!=='undefined'&&x!==null);}
function xObj(x){return(typeof(x)==='object'&&!xArray(x)&&x!==null);}
function xObjOrNull(x){return(typeof(x)==='object'&&!xArray(x));}
function xFunc(x){return xType(x)==='function';}
function xFuncOrNull(x){return(x===null||xType(x)==='function');}
var xArray=Array.isArray||function(obj){return xType(obj)==='array';};function xStr(x){return(typeof(x)==='string');}
function xNum(x){return(typeof(x)==='number');}
function xBool(x){return(typeof(x)==='boolean');}
function xIsNumeric(x){return(!xArray(x)&&(x-parseFloat(x)>=0));}
function xDefAny(aRef,aDefault){return(typeof(aRef)==='undefined'||aRef===null)?aDefault:aRef;}
function xDefAnyOrNull(aRef,aDefault){return(typeof(aRef)==='undefined')?aDefault:aRef;}
function xDefObj(aRef,aDefault){return(typeof(aRef)==='object'&&!xArray(aRef)&&aRef!==null)?aRef:aDefault;}
function xDefObjOrNull(aRef,aDefault){return(typeof(aRef)==='object'&&!xArray(aRef))?aRef:aDefault;}
function xDefFunc(aRef,aDefault){return xFunc(aRef)?aRef:aDefault;}
function xDefFuncOrNull(aRef,aDefault){return xFuncOrNull(aRef)?aRef:aDefault;}
function xDefArray(aRef,aDefault){return xArray(aRef)?aRef:aDefault;}
function xDefStr(aRef,aDefault){return(typeof(aRef)==='string')?aRef:aDefault;}
function xDefNum(aRef,aDefault){return(typeof(aRef)==='number')?aRef:aDefault;}
function xDefBool(aRef,aDefault){return(typeof(aRef)==='boolean')?aRef:aDefault;}
function xArgsToArray(args){return Array.prototype.slice.call(args);}
function xFStr(format,etc){var arg=arguments;var i=1;return format.replace(/(#(#)?)/g,function(match,p1,p2){return p2||arg[i++];});}
function xArrFind(start,arr,func,thisArg){if(!xNum(start))return xArrFind(0,start,arr,func);var t,undef
if(arguments.lenth>3)t=thisArg;var n=arr.length;for(var i=start;i<n;i++){if(func.call(t,arr[i],i,arr))return arr[i];}
return undef;}
function xArrFindIndex(start,arr,func,thisArg){if(!xNum(start))return xArrFindIndex(0,start,arr,func);var t
if(arguments.lenth>3)t=thisArg;var n=arr.length;for(var i=start;i<n;i++){if(func.call(t,arr[i],i,arr))return i;}
return-1;}
function xArrForEach(arr,func,thisArg){var t
if(arguments.length>2)t=thisArg;var n=arr.length;for(var i=0;i<n;i++){func.call(t,arr[i],i,arr);}}
function xArrayMap(arr,func,thisArg){var t
if(arguments.length>2)t=thisArg;var n=arr.length;var newArr=Array(n);for(var i=0;i<n;i++){newArr[i]=func.call(t,arr[i],i,arr);}
return newArr;}
function xArrRemove(arr,func,thisArg){var t,undef
if(arguments.length>2)t=thisArg;var i=0;while(i<arr.length){if(func.call(t,arr[i],i,arr)){var ele=arr[i];arr.splice(i,1);return ele;}else{i++;}}
return undef;}
function xArrRemoveAll(arr,func,thisArg){var t
if(arguments.length>2)t=thisArg;var n=0;var i=0;while(i<arr.length){if(func.call(t,arr[i],i,arr)){arr.splice(i,1);n++;}else{i++;}}
return n;}
function xGet(id){return document.getElementById(id);}
function xGetFirst(selectors){return document.querySelector(selectors);}
function xGetAll(selectors){return document.querySelectorAll(selectors);}
function xElement(e){return(typeof(e)==='string')?document.getElementById(e):e;}
function xDataset(e,name){return xElement(e).getAttribute('data-'+name);}
function xInnerHTML(e,t){if(xStr(t)){xElement(e).innerHTML=t;}else{t=xElement(e).innerHTML;}
return t;}
function xInnerText(e,defaultText){e=xElement(e);if(xDef(e.innerText)){return e.innerText;}
if(xDef(e.textContent)){return e.textContent;}
return defaultText;}
function xTagName(e){return xElement(e).tagName;}
function xShow(e){xVisibility(e,1);}
function xHide(e){xVisibility(e,0);}
function xVisibility(e,v)
{if(xDef(v)){if(!xStr(v))v=v?'visible':'hidden';xElement(e).style.visibility=v;}else{v=xElement(e).style.visibility;}
return v;}
function xDisplay(e,v){e=xElement(e);var old=e.style.display;if(xStr(v)){e.style.display=v;if(old!=v)xTriggerEventDisplayChange(e);}else{v=old;}
return v;}
function xIsDisplayed(e){e=xElement(e);while(xIsElementAndNotRoot(e)){if(getComputedStyle(e).getPropertyValue('display')=='none')return false;e=e.parentNode;}
return true;}
function xMoveTo(e,iX,iY){e=xElement(e);e.style.left=iX+'px';e.style.top=iY+'px';}
function xLeft(e,iX){e=xElement(e);if(xStr(e.style.left)){if(xNum(iX)){e.style.left=iX+'px';}else{iX=parseInt(e.style.left,10);if(isNaN(iX))iX=0;}}
else if(xDef(e.style.pixelLeft)){if(xNum(iX)){e.style.pixelLeft=iX;}else{iX=e.style.pixelLeft;}}else{iX=0;}
return iX;}
function xTop(e,iY){e=xElement(e);if(xStr(e.style.top)){if(xNum(iY)){e.style.top=iY+'px';}else{iY=parseInt(e.style.top,10);if(isNaN(iY))iY=0;}}
else if(xDef(e.style.pixelTop)){if(xNum(iY)){e.style.pixelTop=iY;}
else{iY=e.style.pixelTop;}}else{iY=0;}
return iY;}
function xOpacity(e,uO){if(xNum(uO)){xElement(e).style.opacity=uO;}else{uO=xElement(e).style.opacity;}
return uO;}
function xResizeTo(e,uW,uH,bBorderBoxSizing){xWidth(e,uW,bBorderBoxSizing);xHeight(e,uH,bBorderBoxSizing);}
function xElementWidth(e,uW){if(xNum(uW)){xElement(e).width=uW;}
else{uW=xElement(e).width;}
return uW;}
function xWidth(e,uW,bBorderBoxSizing){if(xNum(uW)){if(uW<0)uW=0;uW=Math.round(uW);xSetCW(xElement(e),uW,bBorderBoxSizing);}else{uW=xElement(e).offsetWidth;}
return uW;}
function xScrollWidth(e){return xElement(e).scrollWidth;}
function xNaturalWidth(img){img=xElement(img);if(xDef(img.naturalWidth))return img.naturalWidth;var tmpImg=new Image();tmpImg.src=img.src;return tmpImg.width;}
function xElementHeight(e,uH){if(xNum(uH)){xElement(e).height=uH;}else{uH=xElement(e).height;}
return uH;}
function xHeight(e,uH,bBorderBoxSizing){if(xNum(uH)){if(uH<0)uH=0;uH=Math.round(uH);xSetCH(xElement(e),uH,bBorderBoxSizing);}
else{uH=xElement(e).offsetHeight;}
return uH;}
function xScrollHeight(e){return xElement(e).scrollHeight;}
function xNaturalHeight(img){img=xElement(img);if(xDef(img.naturalHeight))return img.naturalHeight;var tmpImg=new Image();tmpImg.src=img.src;return tmpImg.height;}
function xGetCS(ele,sP){return parseInt(window.getComputedStyle(ele,'').getPropertyValue(sP),10);}
function xSetCW(ele,uW,bBorderBoxSizing){var pl=0,pr=0,bl=0,br=0;bBorderBoxSizing=xDefBool(bBorderBoxSizing,true);var cssW=uW;if(bBorderBoxSizing){if(window.getComputedStyle){pl=xGetCS(ele,'padding-left');pr=xGetCS(ele,'padding-right');bl=xGetCS(ele,'border-left-width');br=xGetCS(ele,'border-right-width');}
else if(xDef(ele.currentStyle)){pl=parseInt(ele.currentStyle.paddingLeft,10);pr=parseInt(ele.currentStyle.paddingRight,10);bl=parseInt(ele.currentStyle.borderLeftWidth,10);br=parseInt(ele.currentStyle.borderRightWidth,10);}
else{ele.style.width=uW+'px';pl=ele.offsetWidth-uW;}
if(isNaN(pl))pl=0;if(isNaN(pr))pr=0;if(isNaN(bl))bl=0;if(isNaN(br))br=0;cssW-=(pl+pr+bl+br);}
if(cssW<0)cssW=0;ele.style.width=cssW+'px';}
function xSetCH(ele,uH,bBorderBoxSizing){var pt=0,pb=0,bt=0,bb=0;bBorderBoxSizing=xDefBool(bBorderBoxSizing,true);var cssH=uH;if(bBorderBoxSizing){if(window.getComputedStyle){pt=xGetCS(ele,'padding-top');pb=xGetCS(ele,'padding-bottom');bt=xGetCS(ele,'border-top-width');bb=xGetCS(ele,'border-bottom-width');}
else if(xDef(ele.currentStyle)){pt=parseInt(ele.currentStyle.paddingTop,10);pb=parseInt(ele.currentStyle.paddingBottom,10);bt=parseInt(ele.currentStyle.borderTopWidth,10);bb=parseInt(ele.currentStyle.borderBottomWidth,10);}
else{ele.style.height=uH+'px';pt=ele.offsetHeight-uH;}
if(isNaN(pt))pt=0;if(isNaN(pb))pb=0;if(isNaN(bt))bt=0;if(isNaN(bb))bb=0;cssH-=(pt+pb+bt+bb);}
if(cssH<0)cssH=0;ele.style.height=cssH+'px';}
function xClientWidth(){var w=0;if(document.compatMode=='CSS1Compat'&&!window.opera&&document.documentElement&&document.documentElement.clientWidth){w=document.documentElement.clientWidth;}
else if(document.body&&document.body.clientWidth){w=document.body.clientWidth;}
else if(xDef(window.innerWidth)&&xDef(window.innerHeight)&&xDef(document.height)){w=window.innerWidth;if(document.height>window.innerHeight){w-=16;}}
return w;}
function xClientHeight(){var h=0;if(document.compatMode=='CSS1Compat'&&!window.opera&&document.documentElement&&document.documentElement.clientHeight){h=document.documentElement.clientHeight;}
else if(document.body&&document.body.clientHeight){h=document.body.clientHeight;}
else if(xDef(window.innerWidth)&&xDef(window.innerHeight)&&xDef(document.width)){h=window.innerHeight;if(document.width>window.innerWidth){h-=16;}}
return h;}
function xPageX(e){e=xElement(e);var x=0;var n=e;while(xIsElementAndNotRoot(e)){x+=e.offsetLeft;e=e.offsetParent;}
e=n;while(xIsElementAndNotRoot(e)){x-=e.scrollLeft;e=e.parentNode;}
return x;}
function xPageY(e){e=xElement(e);var y=0;var n=e;while(xIsElementAndNotRoot(e)){y+=e.offsetTop;e=e.offsetParent;}
e=n;while(xIsElementAndNotRoot(e)){y-=e.scrollTop;e=e.parentNode;}
return y;}
function xIsRoot(e){return(xAny(e)&&(e==document||e.tagName=='HTML'||e.tagName=='BODY'));}
function xIsElementAndNotRoot(e){return(xAny(e)&&!(e==document||e.tagName=='HTML'||e.tagName=='BODY'));}
function xScrollLeft(e,bWin,val){var offset=0;if(!xDef(e)||bWin||xIsRoot(e)){var w=window;if(bWin&&e)w=e;if(w.document.documentElement&&w.document.documentElement.scrollLeft){if(xNum(val)){w.document.documentElement.scrollLeft=val;}else{offset=w.document.documentElement.scrollLeft;}}
else if(w.document.body&&xDef(w.document.body.scrollLeft)){if(xNum(val)){w.document.body.scrollLeft=val;}else{offset=w.document.body.scrollLeft;}}}
else{if(xNum(val)){xElement(e).scrollLeft=val;}else{offset=xElement(e).scrollLeft;}}
return offset;}
function xScrollTop(e,bWin,val)
{var offset=0;if(!xDef(e)||bWin||xIsRoot(e)){var w=window;if(bWin&&e)w=e;if(w.document.documentElement&&w.document.documentElement.scrollTop){if(xNum(val)){w.document.documentElement.scrollTop=val;}else{offset=w.document.documentElement.scrollTop;}}
else if(w.document.body&&xDef(w.document.body.scrollTop)){if(xNum(val)){w.document.body.scrollTop=val;}else{offset=w.document.body.scrollTop;}}}
else{if(xNum(val)){xElement(e).scrollTop=val;}else{offset=xElement(e).scrollTop;}}
return offset;}
function xZIndex(e,uZ)
{if(xNum(uZ)){xElement(e).style.zIndex=uZ;}else{uZ=parseInt(xElement(e).style.zIndex,10);}
return uZ;}
function xCursor(e,c)
{if(xStr(c)){xElement(e).style.cursor=c;}else{c=xElement(e).style.cursor;}
return c;}
function xStyle(e,sStyle,sVal){if(xDef(sVal)){xElement(e).style[sStyle]=sVal;}else{sVal=xElement(e).style[sStyle];}
return sVal;}
function xMaskRegExp(s){return s.replace(/\-/g,'\\-');}
function xHasClass(e,cls){if(!(e=xElement(e)))return false;if(xDef(e.classList)){return e.classList.contains(cls);}else{if(xIsRoot(e))return false;return e.className.match(new RegExp('(\\s|^)'+xMaskRegExp(cls)+'(\\s|$)'));}}
function xAddClass(e,cls){if(!(e=xElement(e)))return;if(xDef(e.classList)){e.classList.add(cls);}else{if(xIsRoot(e))return;if(!this.xHasClass(e,cls))e.className+=' '+cls;}}
function xRemoveClass(e,cls){if(!(e=xElement(e)))return;if(xDef(e.classList)){e.classList.remove(cls);}else{if(xIsRoot(e))return;if(xHasClass(e,cls)){var reg=new RegExp('(\\s|^)'+xMaskRegExp(cls)+'(\\s|$)');e.className=e.className.replace(reg,' ').replace(/^\s+|\s+$/g,'');}}}
function xToggleClass(e,cls){if(!(e=xElement(e)))return;if(xDef(e.classList)){e.classList.toggle(cls);}else{if(xHasClass(e,cls)){xRemoveClass(e,cls);}else{xAddClass(e,cls);}}}
function xSetClassIf(e,cond,cls){if(cond){xAddClass(e,cls);}else{xRemoveClass(e,cls);}}
function xSetEnabled(e,enabled,cls){xSetClassIf(e,enabled,xDefStr(cls,'enabled'));}
function xSetDisabled(e,disabled,cls){xSetClassIf(e,disabled,xDefStr(cls,'disabled'));}
function xParent(e,bNode){bNode=xDefBool(bNode,true);if(bNode){return xElement(e).parentNode;}
else{return xElement(e).offsetParent;}}
function xCreateElement(sTag){return document.createElement(sTag);}
function xCreateTextNode(s){return document.createTextNode(s);}
function xHasChildNodes(oParent){return oParent.hasChildNodes();}
function xChildNodes(oParent){return oParent.childNodes;}
function xAppendChild(oParent,oChild){return oParent.appendChild(oChild);}
function xInsertBefore(oParent,oChild,oRef){return oParent.insertBefore(oChild,oRef);}
function xRemoveChild(oParent,oChild){return oParent.removeChild(oChild);}
function xGetByTag(t,p){t=t||'*';p=p||document;return p.getElementsByTagName(t);}
function xGetByClass(className,p){p=p||document;return p.getElementsByClassName(className);}
function xAddEvent(e,eventType,callback,cap)
{cap=xDefBool(cap,false);var wrapper=function(e){callback(new xEvent(e));};callback.xWrapperFunc=wrapper;xElement(e).addEventListener(eventType,wrapper,cap);}
function xRemoveEvent(e,eventType,callback,cap){cap=xDefBool(cap,false);xElement(e).removeEventListener(eventType,callback.xWrapperFunc,cap);}
function xEvent(evt){this.Init(evt);}
xEvent.prototype.Init=function(evt){var e=evt||window.event;if(!e)return;this.event=e;this.type=e.type;this.target=e.target||e.srcElement;if(this.target.nodeType==3)this.target=this.target.parentNode;this.relatedTarget=e.relatedTarget;if(e.type=='mouseover'){this.relatedTarget=e.fromElement;}
else if(e.type=='mouseout'){this.relatedTarget=e.toElement;}
if(xDef(e.pageX)){this.pageX=e.pageX;this.pageY=e.pageY;}
else if(xDef(e.clientX)){this.pageX=e.clientX+xScrollLeft();this.pageY=e.clientY+xScrollTop();}
if(xDef(e.offsetX)){this.offsetX=e.offsetX;this.offsetY=e.offsetY;}
else{this.offsetX=this.pageX-xPageX(this.target);this.offsetY=this.pageY-xPageY(this.target);}
this.keyCode=e.keyCode||e.which||0;this.shiftKey=e.shiftKey;this.ctrlKey=e.ctrlKey;this.altKey=e.altKey;if(typeof e.type=='string'){if(e.type.indexOf('click')!=-1){this.button=0;}
else if(e.type.indexOf('mouse')!=-1){this.button=e.button;if(e.button&1){this.button=0;}
else if(e.button&4){this.button=1;}
else if(e.button&2){this.button=2;}}}};xEvent.prototype.PreventDefault=function(){if(!this.event)return;if(this.event.preventDefault)this.event.preventDefault();this.event.returnValue=false;};xEvent.prototype.StopPropagation=function(){if(!this.event)return;if(this.event.stopPropagation)this.event.stopPropagation();this.event.cancelBubble=true;};function xImgOnLoad(img,loadCallback,errorCallback){img=xElement(img);loadCallback=xDefFuncOrNull(loadCallback,null);errorCallback=xDefFuncOrNull(errorCallback,null);var helperImg=new Image();img._xHelperImg=helperImg;if(loadCallback){helperImg.addEventListener('load',function(){img._xHelperImg=null;loadCallback(img);},false);}
if(errorCallback){helperImg.addEventListener('error',function(){img._xHelperImg=null;errorCallback(img,false);},false);helperImg.addEventListener('abort',function(){img._xHelperImg=null;errorCallback(img,true);},false);}
helperImg.src=img.src;}
function xCallbackChain(){this.FuncList=[];this.Active=false;}
xCallbackChain.prototype.Add=function(aFunc,once){once=xDefBool(once,false);if(once&&this.Containes(aFunc))return false;this.FuncList.push(aFunc);return true;}
xCallbackChain.prototype.Contains=function(aFunc){return xDef(xArrFind(this.FuncList,function(func){return func==aFunc;}));}
xCallbackChain.prototype.Remove=function(aFunc){return xArrRemoveAll(this.FuncList,function(func){return func==aFunc;});}
xCallbackChain.prototype.Call=function(aArg,aExceptionFunc){if(this.FuncList.length==0||this.Active)return;this.Active=true;var funcListCopy=this.FuncList.slice();xArrForEach(funcListCopy,function(func){try{func(aArg);}catch(e){if(xFunc(aExceptionFunc))aExceptionFunc(e);}});this.Active=false;}
var xOnLoadFinished=false;var xEventManager={DomReadyHandlers:new xCallbackChain(),MyDomReadyHandlers:[],DomReadyFired:false,PageLoadHandlers:new xCallbackChain(),MyPageLoadHandler:null,PageLoadFired:false,PageUnloadHandlers:new xCallbackChain(),OldWindowOnUnloadHandler:null,MyPageUnloadHandler:null,LayoutChangeHandlers:new xCallbackChain(),MyLayoutChangeHandler:null,WindowResizeHandlers:new xCallbackChain(),WindowResizeTimer:null,MyWindowResizeHandler:null,DisplayChangeHandlers:new xCallbackChain(),AddDomReadyHandler:function(aFunc){var myDomReadyHandler=function(){xEventManager.DomReadyFired=true;xEventManager.RemoveDomReadyHandler(aFunc);try{aFunc();}catch(e){};}
this.MyDomReadyHandlers.push({Func:aFunc,Handler:myDomReadyHandler});if(this.DomReadyFired){setTimeout(myDomReadyHandler,1);}else if(document.addEventListener){document.addEventListener("DOMContentLoaded",myDomReadyHandler,false);}else{this.DomReadyHandlers.Add(myDomReadyHandler);}},RemoveDomReadyHandler:function(aFunc){var handlerInfo=xArrFind(this.MyDomReadyHandlers,function(item){return item.Func==aFunc;});if(!handlerInfo)return;var myDomReadyHandler=handlerInfo.Handler;if(document.addEventListener){document.removeEventListener("DOMContentLoaded",myDomReadyHandler,false);}else{this.DomReadyHandlers.Remove(myDomReadyHandler);}
xArrRemoveAll(this.MyDomReadyHandlers,function(item){return item.Func==aFunc;});},AddPageLoadHandler:function(aFunc){if(!this.MyPageLoadHandler){this.MyPageLoadHandler=function(){xEventManager.PageLoadFired=true;xEventManager.DomReadyHandlers.Call();xEventManager.PageLoadHandlers.Call();xOnLoadFinished=true;}
window.addEventListener('load',this.MyPageLoadHandler);}
if(this.PageLoadFired){setTimeout(function(){try{aFunc();}catch(e){}},1);}else{this.PageLoadHandlers.Add(aFunc);}},RemovePageLoadHander:function(aFunc){this.PageLoadHandlers.Remove(aFunc);},TriggerPageLoad:function(){this.PageLoadHandlers.Call(window);},AddPageUnloadHandler:function(aFunc){if(!this.MyPageUnloadHandler){this.OldWindowOnUnloadHandler=window.onunload;this.MyPageUnloadHandler=function(){if(xEventManager.OldWindowOnUnloadHandler){try{xEventManager.OldWindowOnUnloadHandler();}catch(e){}}
xEventManager.PageUnloadHandlers.Call();}
window.onunload=this.MyPageUnloadHandler;}
this.PageUnloadHandlers.Add(aFunc);},RemovePageUnloadHander:function(aFunc){this.PageUnloadHandlers.Remove(aFunc);},TriggerPageUnload:function(){this.PageUnloadHandlers.Call(window);},AddLayoutChangeHandler:function(aFunc){this.LayoutChangeHandlers.Add(aFunc);if(!this.MyLayoutChangeHandler){this.MyLayoutChangeHandler=function(arg){xEventManager.TriggerLayoutChange(arg);}
this.AddWindowResizeHandler(this.MyLayoutChangeHandler);}},RemoveLayoutChangeHandler:function(aFunc){this.LayoutChangeHandlers.Remove(aFunc);},TriggerLayoutChange:function(aArg){xOptions.Transform.OffsetElement=null;this.LayoutChangeHandlers.Call(aArg);},AddWindowResizeHandler:function(aFunc){if(!this.MyWindowResizeHandler){this.MyWindowResizeHandler=function(){if(xEventManager.WindowResizeTimer){clearTimeout(xEventManager.WindowResizeTimer);}
xEventManager.WindowResizeTimer=setTimeout(function(){clearTimeout(xEventManager.WindowResizeTimer);xEventManager.WindowResizeTimer=null;xEventManager.WindowResizeHandlers.Call();},250);}
xAddEvent(window,'resize',this.MyWindowResizeHandler);}
this.WindowResizeHandlers.Add(aFunc);},RemoveWindowResizeHandler:function(aFunc){this.WindowResizeHandlers.Remove(aFunc);},TriggerWindowResize:function(aArg){this.WindowResizeHandlers.Call(aArg);},AddDisplayChangeHandler:function(aFunc){this.DisplayChangeHandlers.Add(aFunc);},RemoveDisplayChangeHandler:function(aFunc){this.DisplayChangeHandlers.Remove(aFunc);},TriggerDisplayChange:function(aArg){this.DisplayChangeHandlers.Call(aArg);},};function xAddEventLayoutChange(aFunc){xEventManager.AddLayoutChangeHandler(aFunc);}
function xRemoveEventLayoutChange(aFunc){xEventManager.RemoveLayoutChangeHandler(aFunc);}
function xTriggerEventLayoutChange(aArg){xEventManager.TriggerLayoutChange(aArg);}
function xAddEventDisplayChange(aFunc){xEventManager.AddDisplayChangeHandler(aFunc);}
function xRemoveEventDisplayChange(aFunc){xEventManager.RemoveDisplayChangeHandler(aFunc);}
function xTriggerEventDisplayChange(aEle){xEventManager.TriggerDisplayChange(aEle);}
function xAddEventWindowResize(aFunc){xEventManager.AddWindowResizeHandler(aFunc);}
function xRemoveEventWindowResize(aFunc){xEventManager.RemoveWindowResizeHandler(aFunc);}
function xOnDomReady(aFunc){xEventManager.AddDomReadyHandler(aFunc);}
function xOnLoad(aFunc){xEventManager.AddPageLoadHandler(aFunc);}
function xOnUnload(aFunc){xEventManager.AddPageUnloadHandler(aFunc);}
var xOptions={Transform:{PropertyNames:['webkitTransform','MozTransform','msTransform','OTransform','transform'],PropertyName:'?',OffsetElement:null,OffsetX:0,OffsetY:0}};function xGetTransformPropertyName(e){var tf=xOptions.Transform;if(tf.PropertyName!='?')return tf.PropertyName;var names=tf.PropertyNames;var len=names.length;for(var i=0;i<len;i++){var name=names[i];if(xDef(e.style[name])){tf.PropertyName=name;return name;}}
tf.PropertyName='';return'';}
function xSupportsTransform(e){if(!e)e=document.createElement('div');return xGetTransformPropertyName(e)!='';}
function xTransform(e,trans){e=xElement(e);var name=xGetTransformPropertyName(e);if(name=='')return false;e.style[name]=trans;return true;}
function xTransformOrigin(e,origin){e=xElement(e);var name=xGetTransformPropertyName(e);if(name=='')return false;e.style[name+'Origin']=origin;return true;}
function xGetTransformDocOffset(e){var tf=xOptions.Transform;if(tf.OffsetElement!=e){tf.OffsetElement=e;tf.OffsetX=0;tf.OffsetY=0;if(!xTransform(e,'translate(0px,0px)'))return tf;tf.OffsetX=xPageX(e);tf.OffsetY=xPageY(e);}
return tf;}
function xTransformNone(e){e=xElement(e);if(!xTransform(e,'none'))xMoveTo(e,0,0);}
function xTransformTranslate(e,x,y,useWinOrigin){e=xElement(e);useWinOrigin=xDefBool(useWinOrigin,false);var tx=x,ty=y;if(useWinOrigin){var tf=xGetTransformDocOffset(e);tx-=tf.OffsetX;ty-=tf.OffsetY;}
if(!xTransform(e,xFStr('translate(#px,#px)',tx,ty)))xMoveTo(e,x,y);}
function xTransformTranslateScale(e,x,y,w,h,wRef,hRef,useWinOrigin){e=xElement(e);useWinOrigin=xDefBool(useWinOrigin,false);var tx=x,ty=y;if(useWinOrigin){var t=xGetTransformDocOffset(e);tx-=t.OffsetX;ty-=t.OffsetY;}
var xScale=w/wRef;var yScale=h/hRef;var xMove=(wRef/2)*(xScale-1)+tx;var yMove=(hRef/2)*(yScale-1)+ty;var trans=xFStr('matrix(#,0,0,#,#,#)',xScale,yScale,xMove,yMove);if(!xTransform(e,trans)){xMoveTo(e,x,y);xResizeTo(e,w,h);}}
var xClipboardBuffer=null;function xToClipboard(text){if(xDef(window.clipboardData)){window.clipboardData.setData('Text',text);return true;}
else if(document.queryCommandSupported&&document.queryCommandSupported('copy')){var textArea=document.createElement("textarea");textArea.style.position='fixed';textArea.style.width='2em';textArea.style.height='2em';textArea.style.padding=0;textArea.style.border='none';textArea.style.outline='none';textArea.style.boxShadow='none';textArea.style.background='transparent';textArea.value=text;document.body.appendChild(textArea);textArea.select();var done=false;try{done=document.execCommand('copy');}catch(clipboardError){}
document.body.removeChild(textArea);return done;}
return false;}
function xTimeMS(){return(new Date()).getTime();}
function xImage(aImgFilename){var img=new Image();img.src=aImgFilename;return img;}
function xChangeImage(aImgID,aImg){var img=xElement(aImgID);if(img){img.src=aImg.src;}}
function xMultiImage(aImgID){this.ImgID=aImgID;this.Images=[];var a=xMultiImage.arguments;for(var i=1;i<a.length;i++){this.Images[i-1]=xImage(a[i]);}}
xMultiImage.prototype.Show=function(aImageNumber){xChangeImage(this.ImgID,this.Images[aImageNumber]);};var xDbgMess='';var xDbgSep='\n';function xDbg(aMess){if(aMess){xDbgMess+=aMess+xDbgSep;}
else{alert(xDbgMess);}}
function xDbgOut(x){var o=xGet('xdbgout');if(o){o.value=x;}}
function xDbgApp(x){var o=xGet('xdbgout');if(o){o.value+=x+'\n';}}
function xSetCookie(name,value,days){days=days||1;var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires='; expires='+date.toGMTString();document.cookie=name+'='+escape(value)+expires+'; path=/';}
function xGetCookie(name){var cName;var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];var eqPos=c.indexOf('=');if(eqPos>=0){cName=c.substr(0,eqPos).replace(/^\s+|\s+$/g,'');}else{cName=c.replace(/^\s+|\s+$/g,'');}
if(name==cName){if(eqPos<0)return'';return unescape(c.substr(eqPos+1));}}
return null;}
function xDeleteCookie(name){xSetCookie(name,'',-1);}
function htmlString(aStr){var s=aStr;s=s.replace(/</g,'&lt;');s=s.replace(/>/g,'&gt;');return s;}
(function(){var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame'];}
if(!window.requestAnimationFrame)
window.requestAnimationFrame=function(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;};if(!window.cancelAnimationFrame)
window.cancelAnimationFrame=function(id){clearTimeout(id);};}());if(typeof Object.create!='function'){Object.create=(function(){var Temp=function(){};return function(prototype){if(arguments.length>1){throw Error('Second argument not supported');}
if(typeof prototype!='object'){throw TypeError('Argument must be an object');}
Temp.prototype=prototype;var result=new Temp();Temp.prototype=null;return result;};})();}
Function.prototype.inheritsFrom=function(parentClass){this.prototype=Object.create(parentClass.prototype);this.prototype.constructor=this;this.prototype.parentClass=parentClass.prototype;return this;}
var DgdCursor={x:0,y:0,init:function(){var mouseHandler=function(e){DgdCursor.refresh(e);}
document.addEventListener('mousemove',mouseHandler,false);document.addEventListener('touchmove',mouseHandler,false);},refresh:function(e){if(e.type=='mousemove'){this.set(e);}
else if(e.touches){this.set(e.touches[0]);}},set:function(e){if(e.pageX||e.pageY){this.x=e.pageX;this.y=e.pageY;}else if(e.clientX||e.clientY){this.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;this.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;}}};DgdCursor.init();var DgdPosition={get:function(obj){var curleft=0;var curtop=0;if(obj.offsetParent){do{curleft+=obj.offsetLeft;curtop+=obj.offsetTop;}while((obj=obj.offsetParent));}
return[curleft,curtop];}};function DgdSliderHtml(aID,aCaption,aHandleColor,aSliderColor){aCaption=xDefStr(aCaption,'&hArr;');aHandleColor=xDefStr(aHandleColor,'');aSliderColor=xDefStr(aSliderColor,'');var s='';var style='';if(aSliderColor!='')style=' style="background-color: '+aSliderColor+';"';s+='<div id="'+aID+'" class="Slider"'+style+'>';style='';if(aHandleColor!='')style=' style="background-color: '+aHandleColor+';"';s+='<div id="'+aID+'-Handle" class="Handle"'+style+'>'+aCaption+'</div></div>';return s;}
var DgdSlider=function(wrapper,options){if(!(wrapper=xElement(wrapper)))return;var handle=xGetByTag('div',wrapper)[0];if(!xHasClass(handle,'Handle'))return;this.init(wrapper,handle,options||{});this.addListeners();this.setup(false);this.IsLife=true;};DgdSlider.prototype={sliderList:[],animationFrameId:null,init:function(wrapper,handle,options){DgdSlider.prototype.sliderList.push(this);this.isSetup=false;this.wrapper=wrapper;this.handle=handle;this.options=options;this.disabled=this.getOption('disabled',false);this.horizontal=this.getOption('horizontal',true);this.vertical=this.getOption('vertical',false);this.slide=this.getOption('slide',true);this.steps=this.getOption('steps',0);this.snap=this.getOption('snap',false);this.loose=this.getOption('loose',false);this.speed=this.getOption('speed',10)/100;this.xPrecision=this.getOption('xPrecision',0);this.yPrecision=this.getOption('yPrecision',0);this.autoUpdateLayout=this.getOption('autoUpdateLayout',true);this.callback=options.callback||null;this.animationCallback=options.animationCallback||null;this.bounds={left:options.left||0,right:-(options.right||0),top:options.top||0,bottom:-(options.bottom||0),x0:0,x1:0,xRange:0,y0:0,y1:0,yRange:0};this.value={prev:[-1,-1],current:[options.x||0,options.y||0],target:[options.x||0,options.y||0]};this.offset={wrapper:[0,0],mouse:[0,0],prev:[-999999,-999999],current:[0,0],target:[0,0]};this.change=[0,0];this.activity=false;this.dragging=false;this.tapping=false;var self=this;this.selectstartHandler=function(){return false;};this.mousedownHandler=function(e){self.handleDownHandler(e);};this.contextmenuHandler=function(e){e.preventDefault();return false;};this.wrapperMousedownHandler=function(e){self.wrapperDownHandler(e);};this.mouseupHandler=function(e){self.documentUpHandler(e);};this.touchendHandler=function(e){self.documentUpHandler(e);};this.windowResizeHandler=function(){self.documentResizeHandler();};this.mousemoveHandler=function(){self.activity=true;}
this.clickHandler=function(){return!self.activity;}
this.IsLife=false;},free:function(deleteDom){deleteDom=xDefBool(deleteDom,false);xArrRemove(DgdSlider.prototype.sliderList,function(slider){return slider==this;},this);if(DgdSlider.prototype.sliderList.length==0){cancelAnimationFrame(DgdSlider.prototype.animationFrameId);DgdSlider.prototype.animationFrameId=null;}
this.removeListeners();if(deleteDom){var domObj=this.wrapper;if(domObj)xRemoveChild(xParent(domObj),domObj);}
this.IsLife=false;},updateLayout:function(){this.documentResizeHandler();},getOption:function(name,defaultValue){return xDefAnyOrNull(this.options[name],defaultValue);},setup:function(reset){if(!reset&&(this.isSetup||!xIsDisplayed(this.wrapper)))return false;this.setWrapperOffset();this.setBoundsPadding();this.setBounds();this.isSetup=true;return true;},setWrapperOffset:function(){this.offset.wrapper=DgdPosition.get(this.wrapper);},setBoundsPadding:function(){if(!this.bounds.left&&!this.bounds.right){this.bounds.left=DgdPosition.get(this.handle)[0]-this.offset.wrapper[0];this.bounds.right=-this.bounds.left;}
if(!this.bounds.top&&!this.bounds.bottom){this.bounds.top=DgdPosition.get(this.handle)[1]-this.offset.wrapper[1];this.bounds.bottom=-this.bounds.top;}},setBounds:function(){this.bounds.x0=this.bounds.left;this.bounds.x1=this.wrapper.offsetWidth+this.bounds.right;this.bounds.xRange=(this.bounds.x1-this.bounds.x0)-this.handle.offsetWidth;this.bounds.y0=this.bounds.top;this.bounds.y1=this.wrapper.offsetHeight+this.bounds.bottom;this.bounds.yRange=(this.bounds.y1-this.bounds.y0)-this.handle.offsetHeight;this.bounds.xStep=1/(this.xPrecision||Math.max(this.wrapper.offsetWidth,this.handle.offsetWidth));this.bounds.yStep=1/(this.yPrecision||Math.max(this.wrapper.offsetHeight,this.handle.offsetHeight));},addListeners:function(){this.wrapper.addEventListener('selectstart',this.selectstartHandler);this.wrapper.addEventListener('mousedown',this.wrapperMousedownHandler);this.handle.addEventListener('mousedown',this.mousedownHandler);document.addEventListener('mouseup',this.mouseupHandler);this.wrapper.addEventListener('touchstart',this.wrapperMousedownHandler);this.handle.addEventListener('touchstart',this.mousedownHandler);document.addEventListener('touchend',this.touchendHandler);this.wrapper.addEventListener('mousemove',this.mousemoveHandler);this.wrapper.addEventListener('click',this.clickHandler);this.handle.addEventListener('contextmenu',this.contextmenuHandler);this.wrapper.addEventListener('contextmenu',this.contextmenuHandler);if(this.autoUpdateLayout){window.addEventListener('resize',this.windowResizeHandler);xAddEventLayoutChange(this.windowResizeHandler);}
if(DgdSlider.prototype.sliderList.length==1){this.startAnimation();}},removeListeners:function(){this.wrapper.removeEventListener('selectstart',this.selectstartHandler);this.wrapper.removeEventListener('mousedown',this.wrapperMousedownHandler);this.handle.removeEventListener('mousedown',this.mousedownHandler);document.removeEventListener('mouseup',this.mouseupHandler);this.wrapper.removeEventListener('touchstart',this.wrapperMousedownHandler);this.handle.removeEventListener('touchstart',this.mousedownHandler);document.removeEventListener('touchend',this.touchendHandler);this.wrapper.removeEventListener('mousemove',this.mousemoveHandler);this.wrapper.removeEventListener('click',this.clickHandler);this.handle.removeEventListener('contextmenu',this.contextmenuHandler);this.wrapper.removeEventListener('contextmenu',this.contextmenuHandler);if(this.autoUpdateLayout){window.removeEventListener('resize',this.windowResizeHandler);xRemoveEventLayoutChange(this.windowResizeHandler);}},handleDownHandler:function(e){this.activity=false;DgdCursor.refresh(e);this.preventDefaults(e,true);this.startDrag();this.cancelEvent(e);},wrapperDownHandler:function(e){DgdCursor.refresh(e);this.preventDefaults(e,true);this.startTap();},documentUpHandler:function(e){this.stopDrag();this.stopTap();},documentResizeHandler:function(){if(!this.setup(true))return;this.update();},enable:function(){this.disabled=false;xRemoveClass(this.handle,'Disabled');},disable:function(){this.disabled=true;xAddClass(this.handle,'Disabled');},readonly:function(){this.disabled=true;},setStep:function(x,y,snap){this.setValue(this.steps&&x>1?(x-1)/(this.steps-1):0,this.steps&&y>1?(y-1)/(this.steps-1):0,snap);},setValue:function(x,y,snap){this.setTargetValue([x,y||0]);if(snap){this.groupCopy(this.value.current,this.value.target);this.update();}},startTap:function(target){if(this.disabled){return;}
this.tapping=true;if(target===undefined){target=[DgdCursor.x-this.offset.wrapper[0]-(this.handle.offsetWidth/2),DgdCursor.y-this.offset.wrapper[1]-(this.handle.offsetHeight/2)];}
this.setTargetOffset(target);},stopTap:function(){if(this.disabled||!this.tapping){return;}
this.tapping=false;this.setTargetValue(this.value.current);this.result();},startDrag:function(){if(this.disabled){return;}
this.offset.mouse=[DgdCursor.x-DgdPosition.get(this.handle)[0],DgdCursor.y-DgdPosition.get(this.handle)[1]];this.dragging=true;},stopDrag:function(){if(this.disabled||!this.dragging){return;}
this.dragging=false;var target=this.groupClone(this.value.current);if(this.slide){var ratioChange=this.change;target[0]+=ratioChange[0]*4;target[1]+=ratioChange[1]*4;}
this.setTargetValue(target);this.result();},feedback:function(){var value=this.value.current;if(this.snap&&this.steps>1){value=this.getClosestSteps(value);}
if(!this.groupCompare(value,this.value.prev)){if(xFunc(this.animationCallback)){this.animationCallback(value[0],value[1]);}
this.groupCopy(this.value.prev,value);}},result:function(){if(xFunc(this.callback)){this.callback(this.value.target[0],this.value.target[1]);}},startAnimation:function(){DgdSlider.prototype.animationFrameId=requestAnimationFrame(DgdSlider.prototype.onAnimationFrame);this.animate(false,true);},onAnimationFrame:function(time){if(DgdSlider.prototype.sliderList.length>0){DgdSlider.prototype.animationFrameId=requestAnimationFrame(DgdSlider.prototype.onAnimationFrame);DgdSlider.prototype.animateAll();}else{DgdSlider.prototype.animationFrameId=null;}},animateAll:function(){var sl=DgdSlider.prototype.sliderList;var last=sl.length;for(var i=0;i<last;i++){if(sl[i].IsLife)sl[i].animate();}},animate:function(direct,first){if(direct&&!this.dragging){return;}
if(this.dragging){var prevTarget=this.groupClone(this.value.target);var offset=[DgdCursor.x-this.offset.wrapper[0]-this.offset.mouse[0],DgdCursor.y-this.offset.wrapper[1]-this.offset.mouse[1]];this.setTargetOffset(offset,this.loose);this.change=[this.value.target[0]-prevTarget[0],this.value.target[1]-prevTarget[1]];}
if(this.dragging||first){this.groupCopy(this.value.current,this.value.target);}
if(this.dragging||this.glide()||first){this.update();this.feedback();}},glide:function(){var diff=[this.value.target[0]-this.value.current[0],this.value.target[1]-this.value.current[1]];if(!diff[0]&&!diff[1]){return false;}
if(Math.abs(diff[0])>this.bounds.xStep||Math.abs(diff[1])>this.bounds.yStep){this.value.current[0]+=diff[0]*this.speed;this.value.current[1]+=diff[1]*this.speed;}else{this.groupCopy(this.value.current,this.value.target);}
return true;},update:function(){if(!this.snap){this.offset.current=this.getOffsetsByRatios(this.value.current);}else{this.offset.current=this.getOffsetsByRatios(this.getClosestSteps(this.value.current));}
this.show();},show:function(){if(!this.groupCompare(this.offset.current,this.offset.prev)){if(this.horizontal){this.handle.style.left=String(this.offset.current[0])+'px';}
if(this.vertical){this.handle.style.top=String(this.offset.current[1])+'px';}
this.groupCopy(this.offset.prev,this.offset.current);}},setTargetValue:function(value,loose){var target=loose?this.getLooseValue(value):this.getProperValue(value);this.groupCopy(this.value.target,target);this.offset.target=this.getOffsetsByRatios(target);},setTargetOffset:function(offset,loose){var value=this.getRatiosByOffsets(offset);var target=loose?this.getLooseValue(value):this.getProperValue(value);this.groupCopy(this.value.target,target);this.offset.target=this.getOffsetsByRatios(target);},getLooseValue:function(value){var proper=this.getProperValue(value);return[proper[0]+((value[0]-proper[0])/4),proper[1]+((value[1]-proper[1])/4)];},getProperValue:function(value){var proper=this.groupClone(value);proper[0]=Math.max(proper[0],0);proper[1]=Math.max(proper[1],0);proper[0]=Math.min(proper[0],1);proper[1]=Math.min(proper[1],1);if((!this.dragging&&!this.tapping)||this.snap){if(this.steps>1){proper=this.getClosestSteps(proper);}}
return proper;},getRatiosByOffsets:function(group){return[this.getRatioByOffset(group[0],this.bounds.xRange,this.bounds.x0),this.getRatioByOffset(group[1],this.bounds.yRange,this.bounds.y0)];},getRatioByOffset:function(offset,range,padding){return range?(offset-padding)/range:0;},getOffsetsByRatios:function(group){return[this.getOffsetByRatio(group[0],this.bounds.xRange,this.bounds.x0),this.getOffsetByRatio(group[1],this.bounds.yRange,this.bounds.y0)];},getOffsetByRatio:function(ratio,range,padding){return Math.round(ratio*range)+padding;},getClosestSteps:function(group){return[this.getClosestStep(group[0]),this.getClosestStep(group[1])];},getClosestStep:function(value){if(this.steps<=1)return value;var n=this.steps-1;return Math.round(value*n)/n;},groupCompare:function(a,b){return a[0]==b[0]&&a[1]==b[1];},groupCopy:function(a,b){a[0]=b[0];a[1]=b[1];},groupClone:function(a){return[a[0],a[1]];},preventDefaults:function(e,selection){if(!e){e=window.event;}
if(e.preventDefault){e.preventDefault();}
e.returnValue=false;if(selection&&document.selection){document.selection.empty();}},cancelEvent:function(e){if(!e){e=window.event;}
if(e.stopPropagation){e.stopPropagation();}
e.cancelBubble=true;}};
function CNumFormatter(){this.Lang='iso';this.DecimalChar=',';this.MantGrpChar=' ';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar=' ';this.FracGrpSize=3;this.FracGrpMinSize=4;this.TableLike=true;this.ExpChar=' E';this.ExpLeadZero=2;this.ShowExpPlus=true;this.HideZeroExp=false;this.UnitSepChar=' ';this.Mode='std';this.AltMode='eng';this.AltPrec=13;this.Precision=8;this.Prefix=['a','f','p','n','&mu;','m','','k','M','G','T','P','E'];this.Prefix0=6;this.MaxPrec=13;this.MaxDigits=17;}
CNumFormatter.prototype.SetLang=function(aLang){if(aLang=='en'){this.DecimalChar='.';this.MantGrpChar=',';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else if(aLang=='de'){this.DecimalChar=',';this.MantGrpChar='.';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else if(aLang=='ch'){this.DecimalChar=',';this.MantGrpChar='\'';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else{this.DecimalChar=',';this.MantGrpChar=' ';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar=' ';this.FracGrpSize=3;this.FracGrpMinSize=4;}
this.Lang=aLang;}
CNumFormatter.prototype.SetPrefix=function(aPrefixList,aPrefix0){this.Prefix=aPrefixList;this.Prefix0=aPrefix0;}
CNumFormatter.prototype.GetPrefixFromNumParts=function(aNumParts){var ix=aNumParts.PrefixIx;if(ix>=0&&ix<this.Prefix.length){return this.Prefix[ix];}else{return'';}}
CNumFormatter.prototype.IsArray=function(aObj){return(Object.prototype.toString.call(aObj)==='[object Array]');}
CNumFormatter.prototype.IsNumeric=function(x){return(!this.IsArray(x)&&(x-parseFloat(x)>=0));}
CNumFormatter.prototype.FormatNumStr=function(aNumStr){var x=aNumStr.split('.');if(!this.IsNumeric(x[0])||(x.length>1&&!this.IsNumeric(x[1])))return aNumStr;var x1=x[0];var x2=x.length>1?x[1]:'';if(this.MantGrpChar!=''&&this.MantGrpSize>0&&x1!=''&&(this.TableLike||x1.length>this.MantGrpMinSize)){var rgx=new RegExp('(\\d+)(\\d{'+this.MantGrpSize+'})','');while(rgx.test(x1)){x1=x1.replace(rgx,'$1'+this.MantGrpChar+'$2');}}
if(this.FracGrpChar!=''&&this.FracGrpSize>0&&x2!=''&&(this.TableLike||x2.length>this.FracGrpMinSize)){var rgx=new RegExp('(\\d{'+this.FracGrpSize+'})(\\d+)','');while(rgx.test(x2)){x2=x2.replace(rgx,'$1'+this.FracGrpChar+'$2');}}
if(x2!='')x1+=this.DecimalChar+x2;return x1;}
CNumFormatter.prototype.CutTrailingZeros=function(aNumStr){var p=aNumStr.indexOf('.');if(p<0)return aNumStr;var s=aNumStr.replace(/0+$/,'');if(p==(s.length-1)){s=s.substr(0,p);}
return s;}
CNumFormatter.prototype.SplitNumStr=function(aNumStr){var exp=0;var expStr='';var mantStr=aNumStr;var p=mantStr.indexOf('e');if(p<0)p=mantStr.indexOf('E');if(p>0){expStr=mantStr.substr(p+1);mantStr=mantStr.substr(0,p);exp=parseInt(expStr,10);}
return{MantStr:mantStr,ExpStr:expStr,Exp:exp};}
CNumFormatter.prototype.GetExponent=function(aNum,aPrec){if(aPrec<1)aPrec=1;var numSciStr=aNum.toExponential(aPrec-1);var numStrParts=this.SplitNumStr(numSciStr);return numStrParts.Exp;}
CNumFormatter.prototype.NDigits=function(aNumStr){var s=aNumStr.replace(/[eE][+-]?\d+/,'');s=s.replace(/\D/g,'');return s.length;}
CNumFormatter.prototype.ExpToStr=function(aExp,aLeadingZeros){var expStr=aExp.toFixed(0);while(expStr.length<aLeadingZeros)expStr='0'+expStr;return expStr;}
CNumFormatter.prototype.SplitNum=function(aNum,aFormat){var mode=this.Mode;var prec=this.Precision;var units='';if(typeof(aFormat)=='object'){if(typeof(aFormat.Mode)=='string'){mode=aFormat.Mode;}
if(typeof(aFormat.Units)=='string'){units=aFormat.Units;}
if(typeof(aFormat.Precision)=='number'){prec=aFormat.Precision;}}
if(prec<0){prec=0;}
if(prec>this.MaxPrec){prec=this.MaxPrec;}
var numParts={MantSign:1,Mant:aNum,ExpSign:1,Exp:0,Exp3:0,PrefixIx:-1,InitMode:mode,Mode:mode,Precision:prec,Units:units};var mantSign=1;var mant=aNum;if(mant<0){mant=-mant;mantSign=-1;}
numParts.MantSign=mantSign;numParts.Mant=mant;if(mode=='prec'){var exp=this.GetExponent(mant,prec);if(exp<0){mode='std';numParts.Mode=mode;}}
if(mode=='std'){if(prec<1){prec=1;}
numParts.Precision=prec;var nd=prec;var exp=this.GetExponent(mant,prec);var prec1=prec-1;if(exp>=prec1){nd+=exp-prec1;}else{nd+=-exp;}
if(nd>this.MaxDigits){mode=this.AltMode;}else{return numParts;}}else if(mode=='fix'||mode=='fix0'){var precStr=mant.toFixed(prec);var forceExp=(precStr.indexOf('e')>0||precStr.indexOf('E')>0);if(mode=='fix')precStr=this.RemoveTrailingZeros(precStr);var nd=this.NDigits(precStr);if(nd>this.MaxDigits||forceExp){mode=this.AltMode;prec=this.AltPrec;if(prec>this.MaxPrec){prec=this.MaxPrec;}}else{return numParts;}}else if(mode=='weak'||mode=='weak0'){var exp=this.GetExponent(mant,prec);var precStr=mant.toFixed(prec);var forceExp=(precStr.indexOf('e')>0||precStr.indexOf('E')>0);if(mode=='weak')precStr=this.RemoveTrailingZeros(precStr);var nd=this.NDigits(precStr);if(nd>this.MaxDigits||exp<-prec||forceExp){mode=this.AltMode;prec=this.AltPrec;if(prec>this.MaxPrec){prec=this.MaxPrec;}}else{return numParts;}}else if(mode=='prec'){if(prec<1){prec=1;}
numParts.Precision=prec;var exp=this.GetExponent(mant,prec);var precStr=mant.toPrecision(prec);var forceExp=(precStr.indexOf('e')>0||precStr.indexOf('E')>0);var nd=this.NDigits(precStr);if(nd>this.MaxDigits||exp<=-prec||exp>=prec||forceExp){mode=this.AltMode;}else{return numParts;}}else if(mode!=='sci'&&mode!=='eng'&&mode!=='unit'){mode='sci';numParts.Mode=mode;}
if(prec<1){prec=1;}
var exp=0;var expSign=1;var exp3=0;if((mode=='eng'||mode=='unit')&&prec<3)prec=3;exp=this.GetExponent(mant,prec);if(exp<0){expSign=-1;exp=-exp;}
mant/=Math.pow(10,expSign*exp);if(mode==='eng'||mode==='unit'){var corr=exp%3;if(expSign<0){corr=(3-corr)%3;}
if(corr>0){exp-=expSign*corr;mant*=Math.pow(10,corr);}
prec-=corr;exp3=expSign*Math.floor(exp/3);if(mode==='unit'){var prefixIx=exp3+this.Prefix0;if(prefixIx>=0&&prefixIx<this.Prefix.length){exp-=expSign*exp3*3;numParts.PrefixIx=prefixIx;}}}
numParts.Mode=mode;numParts.MantSign=mantSign;numParts.Mant=mant;numParts.ExpSign=expSign;numParts.Exp=exp;numParts.Exp3=exp3;numParts.Precision=prec;return numParts;}
CNumFormatter.prototype.RemoveTrailingZeros=function(numStr){numStr=numStr.replace(/(\.\d*?)0+$/,'$1');numStr=numStr.replace(/\.$/,'');return numStr;}
CNumFormatter.prototype.NumPartsToString=function(aNumParts){function NZeros(aNumZeros){var zz='00000000000000000000';return zz.substr(0,aNumZeros);}
if(isNaN(aNumParts.Mant)||!isFinite(aNumParts.Mant))return aNumParts.Mant.toString();var numStr='';var mode=aNumParts.Mode;var zerosOnly=false;if(mode=='std'){var prec1=aNumParts.Precision-1;numStr=aNumParts.Mant.toExponential(prec1);var numStrParts=this.SplitNumStr(numStr);var mantStr=numStrParts.MantStr.replace('.','');var exp=numStrParts.Exp;if(exp>=0){if(exp<prec1){var p=exp+1;numStr=mantStr.substr(0,p)+'.'+mantStr.substr(p);}else{numStr=mantStr+NZeros(exp-prec1);}}else{numStr='0.'+NZeros(-exp-1)+mantStr;}
if(aNumParts.InitMode!=='prec'){numStr=this.CutTrailingZeros(numStr);}
numStr=this.FormatNumStr(numStr);}else if(mode=='prec'){numStr=aNumParts.Mant.toPrecision(aNumParts.Precision);numStr=this.FormatNumStr(numStr);}else if(mode=='fix'||mode=='fix0'||mode=='weak'||mode=='weak0'){numStr=aNumParts.Mant.toFixed(aNumParts.Precision);var nDigi=this.NDigits(numStr);if(nDigi>this.MaxPrec){var prec1=this.MaxPrec-1;var mantStr=aNumParts.Mant.toExponential(prec1);var numStrParts=this.SplitNumStr(mantStr);mantStr=numStrParts.MantStr.replace('.','');var exp=numStrParts.Exp;if(exp>=0){if(exp<prec1){var p=exp+1;numStr=mantStr.substr(0,p)+'.'+mantStr.substr(p);var nZeros=aNumParts.Precision-(this.MaxPrec-p);numStr+=NZeros(nZeros);}else{numStr=mantStr+NZeros(exp-prec1);if(mode=='fix0'||mode=='weak0'){if(aNumParts.Precision>0)numStr+='.'+NZeros(aNumParts.Precision);}}}}
if(mode=='fix'||mode=='weak')numStr=this.RemoveTrailingZeros(numStr);zerosOnly=(numStr.replace(/[\.0]/g,'')=='');numStr=this.FormatNumStr(numStr);}else{numStr=aNumParts.Mant.toFixed(aNumParts.Precision-1);if(aNumParts.InitMode=='std'){numStr=this.CutTrailingZeros(numStr);}
numStr=this.FormatNumStr(numStr);if(aNumParts.Exp>0||(!this.HideZeroExp&&aNumParts.PrefixIx==-1)){numStr+=this.ExpChar;if(aNumParts.ExpSign<0){numStr+='-';}else if(this.ShowExpPlus){numStr+='+';}
numStr+=this.ExpToStr(aNumParts.Exp,this.ExpLeadZero);}}
if(aNumParts.MantSign<0&&!zerosOnly){numStr='-'+numStr;}
if(numStr!='NaN'&&aNumParts.Units!=''){numStr+=this.UnitSepChar;numStr+=this.GetPrefixFromNumParts(aNumParts);numStr+=aNumParts.Units;}
return numStr;}
CNumFormatter.prototype.NumToString=function(aNum,aFormat){var numParts=this.SplitNum(aNum,aFormat);return this.NumPartsToString(numParts);}
CNumFormatter.prototype.StringToNum=function(aStr){function replaceRegExp(aSrcStr,aRegExpStr,aReplStr){return aSrcStr.replace(new RegExp(aRegExpStr,'g'),aReplStr);}
var s=aStr;var c=this.MantGrpChar;if(c!=''){if(c=='\\')c='\\\\';if(c==']')c='\\]';s=replaceRegExp(s,'['+c+']','');}
c=this.FracGrpChar;if(c!=''){if(c=='\\')c='\\\\';if(c==']')c='\\]';s=replaceRegExp(s,'['+c+']','');}
s=replaceRegExp(s,' ','');s=replaceRegExp(s,',','.')
return Number(s);}
var NumFormatter=new CNumFormatter();
var ControlPanels={Counter:0,PanelList:[],PanelInitList:[],BeforeInitHandlers:new xCallbackChain(),AddBeforeInitHandler:function(func){this.BeforeInitHandlers.Add(func);},NewPanel:function(aParams){return new ControlPanel(aParams);},NewSliderPanel:function(aParams){var panel=this.NewPanel(aParams);panel.NCols=xNum(aParams.NCols)?aParams.NCols*2:2;panel.ValuePos=xDefStr(aParams.ValuePos,'left');if(panel.PanelFormat!='')panel.PanelFormat+=' ';if(panel.ValuePos=='left'){panel.PanelFormat+='Slider Right';}else{panel.PanelFormat+='Slider Left';}
return panel;},ResetButton:function(){return this.SimpleButton('Reset','Reset()','Black','Small',false,false);},ResetButtonR:function(){return this.SimpleButton('Reset','Reset()','Black','Small',true,false);},SmallButtonR:function(text,code,color){return this.SimpleButton(text,code,color,'Small',true,false);},SmallButton:function(text,code,color){return this.SimpleButton(text,code,color,'Small',false,false);},SimpleButton:function(text,code,color,size,right,margin){var params={};params.Text=xDefStr(text,'Reset');params.Code=xDefStr(code,'Reset()');params.Color=xDefStr(color,'Black');if(xStr(size))params.Size=size;if(xBool(right))params.Right=right;if(xBool(margin))params.Margin=margin;return this.Button(params);},Button:function(params){var text=xDefStr(params.Text,'Text');var code=xDefStr(params.Code,'alert("no action defined")');var color=xDefStr(params.Color,'Black');var size=xDefStr(params.Size,'');var right=xDefBool(params.Right,false);var margin=xDefBool(params.Margin,true);var cls=xDefStr(params.Class,'');var aStyle='';var aClass='';var spanClass='lbtn';var spanStyle='';if(right)aStyle=' style="float:right;"';if(cls!='')aClass=' class="'+cls+'"';if(color!='')spanClass+=' lbtn'+color;if(size!='')spanClass+=' lbtn'+size;if(!margin)spanStyle+=' style="margin-bottom:0 !important;margin-top:0 !important;"';if(spanClass!='')spanClass=' class="'+spanClass+'"';return'<a href="javascript:'+code+'"'+aClass+aStyle+'><span'+spanClass+spanStyle+'>'+text+'</span></a>';},Update:function(panelRefs){this.ForEachPanel(function(p){p.Update();},panelRefs);},UpdateLayout:function(panelRefs){this.ForEachPanel(function(p){p.UpdateLayout();},panelRefs);},Invalidate:function(panelRefs,updateGui){this.ForEachPanel(function(p){p.Invalidate(updateGui);},panelRefs);},Reset:function(panelRefs,callOnModelChaned){this.ForEachPanel(function(p){p.Reset(callOnModelChaned);},panelRefs);},ConnectDom:function(panelRefs){this.ForEachPanel(function(p){p.Init();},panelRefs);},Init:function(panelRefs,forceGetDefault){this.ForEachPanel(function(p){p.Init(forceGetDefault);},panelRefs);},IsDisplayed:function(panelName){var panel=this.Get(panelName);return panel?panel.IsDisplayed():false;},IsEnabled:function(panelName,fieldName){var panel=this.Get(panelName);return panel?panel.IsEnabled(fieldName):true;},SetEnabled:function(panelRef,fieldName,enabled){fieldName=xDefStr(fieldName,'');enabled=xDefBool(enabled,true);this.ForEachPanel(function(p){p.SetEnabled(fieldName,enabled);},panelRef);},DeletePanels:function(panelRef,deleteDom){if(!xArray(panelRef))panelRef=this.PanelList.slice();this.ForEachPanel(function(p){p.Delete(deleteDom);},panelRef);},RemovePanel:function(panel){xArrRemove(this.PanelInitList,function(p){return p==panel;});xArrRemove(this.PanelList,function(p){return p==panel;});},AddPanel:function(panel,autoInit){autoInit=xDefBool(autoInit,true);this.PanelList.push(panel);if(xOnLoadFinished||!autoInit)return false;this.PanelInitList.push(panel);if(this.PanelInitList.length==1){xOnLoad(function(){ControlPanels.BeforeInitHandlers.Call();ControlPanels.ForEachPanel(function(p){p.Init();},null,ControlPanels.PanelInitList);ControlPanels.PanelInitList=[];});}
return true;},Get:function(name,panelList){panelList=xDefArray(panelList,this.PanelList);var panel=xArrFind(panelList,function(p){return p.Name==name;});return panel?panel:null;},GetIx:function(name,panelList){panelList=xDefArray(panelList,this.PanelList);return xArrFindIndex(panelList,function(p){return p.Name==name;});},GetField:function(panelName,fieldName){var panel=this.Get(panelName);return panel?panel.GetField(fieldName):null;},ForEachPanel:function(func,panelRefs,panelList){panelList=xDefArray(panelList,this.PanelList);if(!xAny(panelRefs)){xArrForEach(panelList,func);}else if(xArray(panelRefs)){xArrForEach(panelRefs,function(panel){if(xStr(panel))panel=this.Get(panel,panelList);if(panel)func(panel);},this);}else{if(xStr(panelRefs))panelRefs=this.Get(panelRefs,panelList);if(panelRefs)func(panelRefs);}},};function ControlPanel(aParams){ControlPanels.Counter++;aParams=xDefObj(aParams,{});this.Name=xDefStr(aParams.Name,'ControlPanel'+ControlPanels.Counter);this.DomObj=null;this.ModelRef=xDefStr(aParams.ModelRef,'');this.NCols=xDefNum(aParams.NCols,1);this.Attr=xDefStr(aParams.Attr,'');this.Headers=[];this.HeaderAttrs=[];this.Fields=[];this.HiliChanges=xDefBool(aParams.HiliChanges,false);this.DimmDefault=xDefBool(aParams.DimmDefault,false);this.Format=xDefStr(aParams.Format,'fix');this.FormatTab=xDefBool(aParams.FormatTab,true);this.Digits=xDefNum(aParams.Digits,2);this.ReadOnly=xDefBool(aParams.ReadOnly,false);this.Enabled=xDefBool(aParams.Enabled,true);this.EnabledRef=this.MakeRef(aParams.EnabledRef,'');this.PanelFormat=xDefStr(aParams.PanelFormat,'');this.PanelClass=xDefStr(aParams.PanelClass,'ControlPanel');this.LabelClass=xDefStr(aParams.LabelClass,'Label');this.ValueClass=xDefStr(aParams.ValueClass,'Value');this.FieldClass=xDefStr(aParams.FieldClass,'Field');this.HelpImage=xDefStr(aParams.HelpImage,'q.gif');this.OnModelChange=xDefFunc(aParams.OnModelChange,null);this.ModelChangeActive=false;this.FieldCounter=0;this.FieldUpdateLayoutFuncCounter=0;this.LayoutHasChanged=false;this.IsInit=false;this.VisiChangeHandler=null;this.LayoutChangeHandler=null;ControlPanels.AddPanel(this,aParams.AutoInit);}
ControlPanel.prototype.SetLayoutHasChanged=function(){this.LayoutHasChanged=true;}
ControlPanel.prototype.Delete=function(deleteDom){if(this.VisiChangeHandler){Tabs.RemoveVisiChangeHandler(this.DomObj,this.VisiChangeHandler);this.VisiChangeHandler=null;}
if(this.LayoutChangeHandler){xRemoveEventLayoutChange(this.LayoutChangeHandler);this.LayoutChangeHandler=null;}
this.ForEachField(function(field){field.Free();});this.Fields=[];deleteDom=xDefBool(deleteDom,false);if(deleteDom){var domObj=this.GetDomObj();if(domObj)xRemoveChild(xParent(domObj),domObj);}
this.DomObj=null;ControlPanels.RemovePanel(this);this.IsInit=false;}
ControlPanel.prototype.ScriptPath=(function(){var scripts=document.getElementsByTagName('script'),script=scripts[scripts.length-1];var path='';if(script.getAttribute.length!==undefined){path=script.getAttribute('src');}else{path=script.getAttribute('src',2);}
if(path){path=path.substr(0,path.lastIndexOf('/')+1);}
return path;}());ControlPanel.prototype.GetHtmlID=function(){return this.Name;}
ControlPanel.prototype.GetDomObj=function(){return this.DomObj?this.DomObj:xGet(this.GetHtmlID());}
ControlPanel.prototype.MakeFieldName=function(aFieldName){this.FieldCounter++;return xDefStr(aFieldName,'Field'+this.FieldCounter);}
ControlPanel.prototype.MakeFieldHtmlID=function(aFieldName){return this.Name+'-'+aFieldName;}
ControlPanel.prototype.MakeRef=function(aValueRef,aName){var ref=xDefStr(aValueRef,aName);if(ref==='')return null;var refObj={ValueRef:ref};if(ref.indexOf('.')==-1&&this.ModelRef){ref=this.ModelRef+'.'+ref;}
var refx=ref.replace(/\[([^\]]+)\]/g,'.$1');var modelRef=window;var refParts=refx.split('.');var last=refParts.length-1;for(var i=0;i<last;i++){modelRef=modelRef[refParts[i]];}
refObj.RefStr=ref;refObj.ModelRef=modelRef;refObj.PropRef=refParts[last];return refObj;}
ControlPanel.prototype.GetField=function(aFieldOrItemName){var field=xArrFind(this.Fields,function(f){return f.HasName(aFieldOrItemName);});return field?field:null;}
ControlPanel.prototype.ForEachField=function(func){xArrForEach(this.Fields,func,this);}
ControlPanel.prototype.IsEnabled=function(aFieldOrItemName){var field=this.GetField(aFieldOrItemName);return field?field.IsEnabled(aFieldOrItemName):false;}
ControlPanel.prototype.SetEnabled=function(aFieldOrItemName,enabled){enabled=xDefBool(enabled,true);if(!xDef(aFieldOrItemName)||aFieldOrItemName==null)aFieldOrItemName='';if(aFieldOrItemName==''){this.ForEachField(function(field){field.SetEnabled(aFieldOrItemName,enabled);});}else{var field=this.GetField(aFieldOrItemName);if(field)field.SetEnabled(aFieldOrItemName,enabled);}}
ControlPanel.prototype.CallOnModelChange=function(aField,aValue){if(this.ModelChangeActive)return;this.ModelChangeActive=true;if(this.OnModelChange){try{this.OnModelChange(aField,aValue);}catch(err){}}
this.ModelChangeActive=false;}
ControlPanel.prototype.AddHeader=function(aParams){aParams=xDefObj(aParams,{});var txt=xDefStr(aParams.Text,'&nbsp;');var colspan=xDefNum(aParams.ColSpan,1);var attr=xDefStr(aParams.Attr,'');if(colspan>1){if(attr)attr+=' ';attr+='colspan="'+colspan+'"';}
this.HeaderAttrs.push(attr);this.Headers.push(txt);return this;}
ControlPanel.prototype.AddField=function(aField){if(!xObj(aField))return this;this.Fields.push(aField);if(xFunc(aField.UpdateLayout))this.FieldUpdateLayoutFuncCounter++;return this;}
ControlPanel.prototype.GetFieldHtml=function(aField,aColIx){function StartTag(aClass,aColSpan,aAttr,aColIx){var css='';var colsp='';var attr='';if(aColSpan>1)colsp=' colspan="'+aColSpan+'"';if(aClass)css=aClass;css=' class="'+css+' Col'+aColIx+'"';if(aAttr)attr=' '+aAttr;var tag='<td'+colsp+css+attr+'>';return tag;};function EndTag(){return'</td>';};function LabelHtml(aLabel,aDescription){if(aLabel=='')return'';if(aDescription=='')return'<div class="FieldText">'+aLabel+'</div>';return'<div class="FieldText" title="'+aDescription+'">'+aLabel+'</div>';}
function AppendixHtml(aDescription,aLink,aHelpImage){if(this.HelpImage=='')return'';if(aLink){if(aDescription){return' '+'<a href="'+aLink+'" target="_blank" title="&rArr; '+aDescription+'"><img class="HelpImg" src="'+ControlPanel.prototype.ScriptPath+aHelpImage+'" alt=""></a>';}else{return' '+'<a href="'+aLink+'" target="_blank" title="&rArr; Infos"><img class="HelpImg" src="'+ControlPanel.prototype.ScriptPath+aHelpImage+'" alt=""></a>';}}else{if(aDescription){return' '+'<span><img class="HelpImg" src="'+ControlPanel.prototype.ScriptPath+aHelpImage+'" title="'+aDescription+'" alt=""></span>';}else{return'';}}}
var colspan=aField.ColSpan;var descr=aField.Description;var link=aField.Link;var attr=aField.Attr;var s='';if((colspan%2)==1){s+=StartTag(aField.LabelClass,1,'',aColIx)+LabelHtml(aField.Label,descr)+EndTag();s+=StartTag(aField.ValueClass,colspan,attr,aColIx+1)+aField.GetHtml()+AppendixHtml(descr,link,this.HelpImage)+EndTag();}else{s+=StartTag(aField.ValueClass,colspan,attr,aColIx)+aField.GetHtml()+AppendixHtml(descr,link,this.HelpImage)+EndTag();}
return s;}
ControlPanel.prototype.GetHtml=function(){var html='';var attr=this.Attr;var css=this.PanelClass+' NCols'+this.NCols;if(this.PanelFormat)css+=' '+this.PanelFormat;css=' class="'+css+'"';if(attr)attr=' '+attr;html+='<table id="'+this.Name+'"'+css+attr+'>';if(this.Headers.length>0){html+='<tr class="HdRow">';for(var i=0;i<this.Headers.length;i++){css=' class="HdCol'+(i+1)+'"';attr=this.HeaderAttrs[i];if(attr)attr=' '+attr;html+='<th'+css+attr+'>'+this.Headers[i]+'</th>';}
html+='</tr>';}
var thisCols=2*this.NCols;var coli=1;var rowi=1;var col=0;html+='<tr class="Row1">';for(var i=0;i<this.Fields.length;i++){var field=this.Fields[i];var s=this.GetFieldHtml(field,coli);html+=s;var nCols=1;var colspan=xDefNum(field.ColSpan,1);if((colspan%2)==1){nCols=1+colspan;coli++;}else{nCols=colspan;}
col+=nCols;coli++;if(((col%thisCols)==0)&&(i<(this.Fields.length-1))){rowi++;coli=1;html+='</tr><tr class="Row'+rowi+'">';}}
var remCols=thisCols-(col%thisCols);if(remCols==thisCols)remCols=0;var cs='';if(remCols>1){cs=' colspan="'+remCols+'"';html+='<td'+cs+' class="Col'+coli+'">&nbsp;</td>';}
html+='</tr></table>';return html;}
ControlPanel.prototype.Render=function(){document.writeln(this.GetHtml());return this;}
ControlPanel.prototype.Init=function(forceGetDefault){var me=this;this.DomObj=xGet(this.GetHtmlID());this.ForEachField(function(field){field.Init(forceGetDefault);});if(xDef(window.Tabs)&&this.FieldUpdateLayoutFuncCounter>0){if(this.DomObj){this.VisiChangeHandler=function(boxData){me.UpdateLayout(boxData.IsVisible?1:0);}
Tabs.AddVisiChangeHandler(this.DomObj,this.VisiChangeHandler);}}
if(!this.IsInit){this.LayoutChangeHandler=function(){me.UpdateLayout();}
xAddEventLayoutChange(this.LayoutChangeHandler);}
this.IsInit=true;this.Update();}
ControlPanel.prototype.Invalidate=function(bUpdateGui){this.ForEachField(function(field){field.Invalidate();});if(bUpdateGui)this.Update();}
ControlPanel.prototype.Reset=function(bCallOnModelChange,bUpdateGui){var prevState=this.ModelChangeActive;this.ModelChangeActive=true;this.ForEachField(function(field){field.Reset(false);});this.ModelChangeActive=prevState;if(bCallOnModelChange)this.CallOnModelChange(null);if(bUpdateGui)this.Update();}
ControlPanel.prototype.Update=function(){if(!this.IsInit)return;var oldFormatTab=NumFormatter.TableLike;NumFormatter.TableLike=this.FormatTab;this.ForEachField(function(field){field.Update();});NumFormatter.TableLike=oldFormatTab;if(this.LayoutHasChanged){this.UpdateLayout();this.LayoutHasChanged=false;}}
ControlPanel.prototype.UpdateLayout=function(visiState){if(!this.IsInit)return;visiState=xDefNum(visiState,-1);if(visiState==-1)visiState=xIsDisplayed(this.DomObj)?1:0;this.ForEachField(function(field){field.UpdateLayout(visiState);});}
ControlPanel.prototype.IsDisplayed=function(){return xIsDisplayed(this.Name);}
ControlPanel.prototype.ParseWikiLink=function(aLink){if(aLink.indexOf('[[')!=0)return aLink;var pageName=aLink.substr(2,aLink.length-2);if(pageName.lastIndexOf(']]')!=pageName.length-2)return aLink;pageName=pageName.substring(0,pageName.length-2);var pars='';var subHeader='';var p=pageName.indexOf('~');if(p>0){pars=escape(pageName.substring(p+1));pars=pars.replace(/%3D/g,'=');pars=pars.replace(/%7E/g,'~');pars=pars.replace(/%20/g,'+');pars=pars.replace(/%5C%5C/g,'\\');pars=pars.replace(/%5C=/g,'%3D');pars=pars.replace(/%5C~/g,'%7E');pars=pars.replace(/\\/g,'%5C');pars=pars.replace(/~/g,'&');pars='&'+pars;pageName=pageName.substring(0,p);}
p=pageName.indexOf('#');if(p>=0){subHeader=escape(pageName.substring(p+1));subHeader=subHeader.replace(/%2E/g,'.');subHeader=subHeader.replace(/%2D/g,'-');subHeader=subHeader.replace(/%20/g,'_');subHeader=subHeader.replace(/%/g,'.');subHeader=subHeader.replace(/\+/g,'_');subHeader='#H_'+subHeader;pageName=pageName.substring(0,p);}
pageName=pageName.replace(/ /g,'+');return ASP_PAGE+'?page='+escape(pageName)+pars+subHeader;}
ControlPanel.prototype.AddEmptyField=function(aParams){var param={Label:'-',Html:'&nbsp;'};if(xObj(aParams)){if(xStr(aParams.Name))param.Name=aParams.Name;if(xNum(aParams.ColPan))param.ColSpan=aParams.ColSpan;if(xStr(aParams.Attr))param.Attr=aParams.Attr;}
return this.AddField(new CpHtmlField(this,param));}
ControlPanel.prototype.AddTextField=function(aParams){return this.AddField(new CpTextField(this,aParams));}
ControlPanel.prototype.AddHtmlField=function(aParams){return this.AddField(new CpHtmlField(this,aParams));}
function CpField(aParentPanel,aParams){aParams=xDefObj(aParams,{});this.Panel=aParentPanel;this.Name=aParentPanel.MakeFieldName(aParams.Name);this.DomObj=null;this.Default='';this.ValidDefault=false;this.HtmlID=aParentPanel.MakeFieldHtmlID(this.Name);this.ValueRef=aParentPanel.MakeRef(aParams.ValueRef,this.Name);this.ReadOnly=xDefBool(aParams.ReadOnly,false);this.Enabled=xDefBool(aParams.Enabled,aParentPanel.Enabled);this.EnabledRef=aParentPanel.EnabledRef;if(xStr(aParams.EnabledRef))this.EnabledRef=aParentPanel.MakeRef(aParams.EnabledRef,'');this.Label=xDefStr(aParams.Label,this.Name);if(this.Label=='-')this.Label='&nbsp;';this.Description=xDefStr(aParams.Description,'');this.Link=xDefStr(aParams.Link,'');if(this.Link)this.Link=aParentPanel.ParseWikiLink(this.Link);this.ColSpan=xDefNum(aParams.ColSpan,1);this.LabelClass=xDefStr(aParams.LabelClass,aParentPanel.LabelClass);this.ValueClass=xDefStr(aParams.ValueClass,aParentPanel.ValueClass);this.Attr=xDefStr(aParams.Attr,'');}
CpField.prototype.Free=function(){this.Panel=null;this.DomObj=null;}
CpField.prototype.GetValueRef=function(){return this.ValueRef.ValueRef;}
CpField.prototype.HasName=function(aName){return this.Name==aName;}
CpField.prototype.GetHtmlID=function(itemRef){return this.HtmlID;}
CpField.prototype.GetDomObj=function(itemRef){return this.DomObj?this.DomObj:xGet(this.HtmlID);}
CpField.prototype.ValueFromModel=function(aValueRef){return(aValueRef.RefStr)?aValueRef.ModelRef[aValueRef.PropRef]:0;};CpField.prototype.ValueToModel=function(aValue,aValueRef,bUpdateGui,bCallOnModelChange){bUpdateGui=xDefBool(bUpdateGui,false);bCallOnModelChange=xDefBool(bCallOnModelChange,false);var oldModelValue=this.ValueFromModel(aValueRef);var doChangeModel=oldModelValue!=aValue;if(doChangeModel){aValueRef.ModelRef[aValueRef.PropRef]=aValue;}
if(bCallOnModelChange&&this.Panel.OnModelChange===null)bUpdateGui=true;if(bUpdateGui)this.Update();if(doChangeModel&&bCallOnModelChange)this.Panel.CallOnModelChange(this,aValue);}
CpField.prototype.IsEnabled=function(){return this.Enabled;}
CpField.prototype.SetEnabled=function(ignoredItemName,enabled){if(!this.EnabledRef)this.SetGuiEnabled(xDefBool(enabled,true));}
CpField.prototype.SetGuiEnabled=function(enabled){this.Enabled=enabled;}
CpField.prototype.UpdateLayout=function(visiState){}
function CpHtmlField(aPanel,aParams){aParams=xDefObj(aParams,{});this.parentClass.constructor.call(this,aPanel,aParams);this.Html=xDefStr(aParams.Html,'');this.LastHtml='';this.ValidLast=false;}
CpHtmlField.inheritsFrom(CpField);CpHtmlField.prototype.GetHtml=function(){return'<div id="'+this.HtmlID+'" class="HtmlField">'+xDefStr(this.Html,'&nbsp;')+'</div>';}
CpHtmlField.prototype.GetType=function(){return'HtmlField';}
CpHtmlField.prototype.Init=function(forceGetDefault){this.DomObj=xGet(this.HtmlID);}
CpHtmlField.prototype.Invalidate=function(){this.ValidLast=false;}
CpHtmlField.prototype.Update=function(){if(!this.DomObj)return;var txt=this.Html;if(txt===''&&this.ValueRef.RefStr!=='')txt=this.ValueFromModel(this.ValueRef);if(txt==='')txt='&nbsp;';if(this.ValidLast&&this.LastHtml===txt)return;xInnerHTML(this.DomObj,txt);this.LastHtml=txt;this.ValidLast=true;}
CpHtmlField.prototype.Reset=function(){}
function CpTextField(aPanel,aParams){aParams=xDefObj(aParams,{});this.parentClass.constructor.call(this,aPanel,aParams);this.ConvToModelFunc=xDefFunc(aParams.ConvToModelFunc,null);this.ConvFromModelFunc=xDefFunc(aParams.ConvFromModelFunc,null);this.ReadOnly=xDefBool(aParams.ReadOnly,aPanel.ReadOnly);this.HiliChanges=xDefBool(aParams.HiliChanges,aPanel.HiliChanges);this.DimmDefault=xDefBool(aParams.DimmDefault,aPanel.DimmDefault);this.Mult=1;var m=aParams.Mult;if(xNum(m)||(xArray(m)&&m.length>=2&&xFunc(m[0])&&xFunc(m[1])))this.Mult=m;this.MultRef=aPanel.MakeRef(aParams.MultRef,'');this.Units=xDefStr(aParams.Units,'');this.UnitsRef=aPanel.MakeRef(aParams.UnitsRef,'');this.Digits=xDefNum(aParams.Digits,aPanel.Digits);this.DigitsRef=aPanel.MakeRef(aParams.DigitsRef,'');this.Format=xDefStr(aParams.Format,aPanel.Format);this.FormatRef=aPanel.MakeRef(aParams.FormatRef,'');var me=this;this.OnChangeFunc=function(e){me.HandleChange(e);};this.OnKeyDownFunc=function(e){me.HandleKeyDown(e);};this.OnFocusFunc=function(e){me.HandleFocus(e);};this.LastValue=0;this.LastMult=1;this.LastUnits='';this.LastFormat='';this.LastDigits=0;this.LastHiliCss='';this.ValidLast=false;}
CpTextField.inheritsFrom(CpField);CpTextField.prototype.Free=function(){if(!this.ReadOnly)this.RemoveEventHandlers();this.parentClass.Free.call(this);}
CpTextField.prototype.GetType=function(){return'TextField';}
CpTextField.prototype.GetHtml=function(){function InputTag(aName,aClass,aValue,bReadOnly){var css=''
if(bReadOnly)css='ReadOnly';if(aClass){if(css)css+=' ';css+=aClass;}
if(css)css=' class="'+css+'"';var readonly='';if(bReadOnly)readonly=' readonly="readonly"';var name='';if(aName)name=' name="'+aName+'" id="'+aName+'"';return'<input type="text"'+name+css+readonly+' value="'+aValue+'">';};function UnitHtml(aName,aUnits,aUnitsRef){if(aUnits||aUnitsRef){return'<div class="FieldText" id="'+aName+'-Unit">'+aUnits+'</div>';}else{return'';}}
var input='';if(this.ValueRef)input=InputTag(this.HtmlID,this.Panel.FieldClass,'',this.ReadOnly);input+=UnitHtml(this.HtmlID,this.Units,this.UnitsRef);return input;}
CpTextField.prototype.AddEventHandlers=function(){xAddEvent(this.DomObj,'change',this.OnChangeFunc);xAddEvent(this.DomObj,'keydown',this.OnKeyDownFunc);xAddEvent(this.DomObj,'focus',this.OnFocusFunc);xAddEvent(this.DomObj,'click',this.OnFocusFunc);}
CpTextField.prototype.RemoveEventHandlers=function(){xRemoveEvent(this.DomObj,'change',this.OnChangeFunc);xRemoveEvent(this.DomObj,'keydown',this.OnKeyDownFunc);xRemoveEvent(this.DomObj,'focus',this.OnFocusFunc);xRemoveEvent(this.DomObj,'click',this.OnFocusFunc);}
CpTextField.prototype.GetEnabledFromModel=function(){return(this.EnabledRef)?this.ValueFromModel(this.EnabledRef):this.Enabled;}
CpTextField.prototype.SetGuiEnabled=function(enabled,force){force=xDefBool(force,false);if(enabled){if(this.Enabled&&!force)return;if(this.DomObj&&!this.ReadOnly)this.DomObj.disabled=false;this.Enabled=true;}else{if(!this.Enabled&&!force)return;if(this.DomObj&&!this.ReadOnly)this.DomObj.disabled=true;this.Enabled=false;}}
CpTextField.prototype.SetFieldNum=function(aNum){if(this.Format){var format={Mode:this.Format,Precision:this.Digits};var numParts=NumFormatter.SplitNum(aNum,format);var numStr=NumFormatter.NumPartsToString(numParts);this.DomObj.value=numStr;if(this.Units||this.Format==='unit'||this.UnitsRef){var prefix=NumFormatter.GetPrefixFromNumParts(numParts);xInnerHTML(this.HtmlID+'-Unit',prefix+this.Units);}}else{this.DomObj.value=aNum.toString();if(this.Units||this.UnitsRef)xInnerHTML(this.HtmlID+'-Unit',this.Units);}}
CpTextField.prototype.Init=function(forceGetDefault){forceGetDefault=xDefBool(forceGetDefault,false);this.DomObj=xGet(this.HtmlID);if(!this.DomObj||!this.ValueRef)return;if(!this.ReadOnly)this.AddEventHandlers();if(!this.ValidDefault||forceGetDefault){this.Default=this.ValueFromModel(this.ValueRef);this.ValidDefault=true;}
this.ValidLast=false;var enable=this.GetEnabledFromModel();this.SetGuiEnabled(enable,true);}
CpTextField.prototype.Invalidate=function(){this.ValidLast=false;}
CpTextField.prototype.Reset=function(bCallOnModelChange){if(this.ReadOnly)return;this.ValidLast=false;this.ValueToModel(this.Default,this.ValueRef,false,bCallOnModelChange);}
CpTextField.prototype.Store=function(){if(!this.DomObj)return;var v;if(!this.ConvToModelFunc){if(xNum(this.Mult)){if(this.Mult!=0){v=this.Mult*NumFormatter.StringToNum(this.DomObj.value);}else{v=this.DomObj.value;}}else{var ConvertInputToModelFunc=this.Mult[0];v=ConvertInputToModelFunc(NumFormatter.StringToNum(this.DomObj.value));}}else{v=this.ConvToModelFunc(this.DomObj.value);}
this.ValueToModel(v,this.ValueRef,true,true);}
CpTextField.prototype.GetRefsFromModel=function(){if(this.MultRef)this.Mult=this.ValueFromModel(this.MultRef);if(this.FormatRef)this.Format=this.ValueFromModel(this.FormatRef);if(this.DigitsRef)this.Digits=this.ValueFromModel(this.DigitsRef);if(this.UnitsRef)this.Units=this.ValueFromModel(this.UnitsRef);}
CpTextField.prototype.CheckGuiUpdate=function(aValue,aHiliCss){this.GetRefsFromModel();if(this.ValidLast){var updateNeedet=(this.LastValue!=aValue||this.LastMult!=this.Mult||this.LastUnits!=this.Units||this.LastFormat!=this.Format||this.LastDigits!=this.Digits||this.LastHiliCss!=aHiliCss);if(!updateNeedet){return false;}}
if(this.LastUnits!=this.Units){this.Panel.SetLayoutHasChanged();}
this.LastValue=aValue;this.LastMult=this.Mult;this.LastUnits=this.Units;this.LastFormat=this.Format;this.LastDigits=this.Digits;this.LastHiliCss=aHiliCss;this.ValidLast=true;return true;}
CpTextField.prototype.Update=function(){if(!this.DomObj)return;var v=this.ValueFromModel(this.ValueRef);var hiliCss='';if(this.ReadOnly){if(!this.ValidLast&&this.DimmDefault)hiliCss='Dimmed';}else{if(v!=this.Default&&this.HiliChanges)hiliCss='Changed';}
if(!this.ConvFromModelFunc){if(this.CheckGuiUpdate(v,hiliCss)){if(xNum(this.Mult)){if(this.Mult!=0){this.SetFieldNum(v/this.Mult);}else{this.DomObj.value=v;}}else{var ConvertModelToInputFunc=this.Mult[1];this.SetFieldNum(ConvertModelToInputFunc(v));}
if(hiliCss!=='Dimmed')xRemoveClass(this.DomObj,'Dimmed');if(hiliCss!=='Changed')xRemoveClass(this.DomObj,'Changed');if(hiliCss!=='')xAddClass(this.DomObj,hiliCss);}}else{this.DomObj.value=this.ConvFromModelFunc(v);}
var enable=this.GetEnabledFromModel();this.SetGuiEnabled(enable);}
CpTextField.prototype.HandleChange=function(aEvent){if(!this.Enabled){aEvent.PreventDefault();return;}
this.Store();}
CpTextField.prototype.HandleKeyDown=function(aEvent){if(!this.Enabled){aEvent.PreventDefault();return true;}
var key=String.fromCharCode(aEvent.keyCode)
if(aEvent.keyCode==13){if(!this.DomObj)return true;var v=this.DomObj.value;var m=this.Mult;var isNumericMult=(xNum(m)&&m!==0)||xArray(m);if(isNumericMult&&v.replace(/\s+/g,'')===''){this.Reset(true);}else if(v===' '){this.Reset(true);}else{this.Store();return false;}}else if(aEvent.keyCode==27){this.Reset(true);}else if((key=='Y')&&aEvent.ctrlKey&&!aEvent.altKey&&!aEvent.shiftKey){if(!this.DomObj)return true;this.DomObj.value='';return false;}
return true;}
CpTextField.prototype.HandleFocus=function(aEvent){if(!this.Enabled){aEvent.PreventDefault();return;}
this.DomObj.select();}
ControlPanel.prototype.CheckboxOrRadiobuttonHtml=function(aType,aName,aClass,bReadOnly,aItems,aNCols){var s='';var n=aItems.length-1;var nCols=aNCols;if(nCols<=0)nCols=n+1;if(nCols<=0)nCols=1;var nRows=Math.floor(n/nCols)+1;var colw=Math.floor(100/nCols);s+='<table class="FieldGrid">';var isCheckbox=(aType=='checkbox');var i=0;for(var row=1;row<=nRows;row++){s+='<tr>';for(var col=1;col<=nCols;col++){var css='FieldCell';var attrs='';if(row<=1)attrs+=' style="width:'+colw+'%;"';if((i<=n)&&(aItems[i].Text!='-')){if(isCheckbox){var name=this.MakeFieldHtmlID(aItems[i].Name);var id=name;bReadOnly=aItems[i].ReadOnly;}else{var name=this.MakeFieldHtmlID(aName);var id=name;if(n>0)id+='-'+i;}
if(bReadOnly)css+=' ReadOnly';attrs+=' class="'+css+'" id="'+id+'-Field"';s+='<td'+attrs+'>';attrs=' type="'+aType+'" id="'+id+'" name="'+name+'" class="'+aClass+'" value="'+aItems[i].Value+'"';if(bReadOnly)attrs+=' disabled="disabled"';s+='<div class="FieldText">'+'<input'+attrs+'>';s+='<span class="FieldCaption">'+aItems[i].Text+'&nbsp;</span></div>';}else{s+='<td>&nbsp;';}
s+='</td>';i++;}
s+='</tr>';}
s+='</table>';return s;}
ControlPanel.prototype.GetFieldCell=function(aInputElement){var domEle=aInputElement;while(domEle){domEle=xParent(domEle);if(xHasClass(domEle,'FieldCell'))return domEle;}
return null;}
ControlPanel.prototype.AddCheckboxField=function(aParams){return this.AddField(new CpCheckboxField(this,aParams));}
function CpCheckboxField(aPanel,aParams){aParams=xDefObj(aParams,{});this.parentClass.constructor.call(this,aPanel,aParams);this.Items=[];if(xArray(aParams.Items)){var itemsDef=aParams.Items;var nItemsDef=itemsDef.length;for(var i=0;i<nItemsDef;i++){var itemDef=itemsDef[i];if(itemDef){var item={};item.Name=xDefStr(itemDef.Name,this.Name+'-'+i);item.HtmlID=aPanel.MakeFieldHtmlID(item.Name);item.ValueRef=aPanel.MakeRef(itemDef.ValueRef,item.Name);item.Value=xDefStr(itemDef.Value,item.Name);item.Text=xDefStr(itemDef.Text,item.Name);if(item.Text=='-')item.Text='';item.ReadOnly=xDefBool(itemDef.ReadOnly,this.ReadOnly);item.Enabled=xDefBool(itemDef.Enabled,this.Enabled);item.EnabledRef=this.EnabledRef;if(xStr(itemDef.EnabledRef))item.EnabledRef=aPanel.MakeRef(itemDef.EnabledRef,'');item.Default=false;item.ValidDefault=false;item.DomObj=null;item.LastValue='';item.ValidLast=false;item.CheckboxChangeHandler=null;item.CellClickHandler=null;this.Items.push(item);}}}
this.NCols=xDefNum(aParams.NCols,this.Items.length);}
CpCheckboxField.inheritsFrom(CpField);CpCheckboxField.prototype.GetType=function(){return'CheckboxField';}
CpCheckboxField.prototype.Free=function(){xArrForEach(this.Items,function(item){var cbDomObj=item.DomObj;if(!item.ReadOnly&&cbDomObj&&item.CheckboxChangeHandler){xRemoveEvent(cbDomObj,'change',item.CheckboxChangeHandler);xRemoveEvent(cbDomObj,'click',item.CheckboxChangeHandler);var clickArea=this.Panel.GetFieldCell(cbDomObj);if(clickArea){xRemoveEvent(clickArea,'click',item.CellClickHandler);}}
item.DomObj=null;},this);this.parentClass.Free.call(this);}
CpCheckboxField.prototype.ForEachItem=function(func){xArrForEach(this.Items,func,this);}
CpCheckboxField.prototype.GetItem=function(aName){var item=xArrFind(this.Items,function(item){return item.Name==aName;});return item?item:null;}
CpCheckboxField.prototype.HasName=function(aName){return(this.Name==aName||this.GetItem(aName)!=null);}
CpCheckboxField.prototype.GetValueRef=function(aItemName){var valueRef=this.ValueRef;if(xStr(aItemName)){var item=this.GetItem(aItemName);if(!tem)valueRef=item.ValueRef;}
return valueRef?valueRef.ValueRef:'';}
CpCheckboxField.prototype.GetHtmlID=function(itemName){if(!xStr(itemName))return this.HtmlID;var item=this.GetItem(itemName);return item?item.HtmlID:'';}
CpCheckboxField.prototype.GetDomObj=function(itemName){if(!xStr(itemName))return null;var item=this.GetItem(itemName);return item?item.DomObj:null;}
CpCheckboxField.prototype.GetEnabledFromModel=function(item){if(xStr(item)){item=this.GetItem(item);if(!item)return null;}else if(xNum(item)){item=this.Items[item];}
if(item.EnabledRef)return this.ValueFromModel(item.EnabledRef);return item.Enabled;}
CpCheckboxField.prototype.IsEnabled=function(itemName){if(!xDef(itemName)||itemName==null)itemName='';var item=(itemName=='')?this.Items[0]:this.GetItem(itemName);return item?item.Enabled:true;}
CpCheckboxField.prototype.SetEnabled=function(itemRef,enabled){enabled=xDefBool(enabled,true);if(!xDef(itemRef)||itemRef==null)itemRef='';if(xStr(itemRef)&&itemRef==''){xArrForEach(this.Items,function(item){if(!item.EnabledRef)this.SetItemGuiEnabled(item,enabled);},this);}else{var item=xStr(itemName)?this.GetItem(itemName):itemName;if(item&&!item.EnabledRef)this.SetItemGuiEnabled(item,enabled);}}
CpCheckboxField.prototype.SetItemGuiEnabled=function(item,enabled,force){var force=xDefBool(force,false);var fieldCellId=item.HtmlID+'-Field';if(enabled){if(item.Enabled&&!force)return;xRemoveClass(fieldCellId,'Disabled');item.Enabled=true;}else{if(!item.Enabled&&!force)return;xAddClass(fieldCellId,'Disabled');item.Enabled=false;}}
CpCheckboxField.prototype.OnChange=function(aEvent,aCheckboxIx){aEvent.StopPropagation();var item=this.Items[aCheckboxIx];if(!item.Enabled){aEvent.PreventDefault();return;}
if(!item.DomObj)return;var v=item.DomObj.checked;this.ValueToModel(v,item.ValueRef,false,true);}
CpCheckboxField.prototype.OnTextClick=function(aEvent,aCheckboxIx){var item=this.Items[aCheckboxIx];if(!item.Enabled)return;var domObj=item.DomObj;if(domObj)domObj.checked=!domObj.checked;this.OnChange(aEvent,aCheckboxIx);}
CpCheckboxField.prototype.GetHtml=function(){return this.Panel.CheckboxOrRadiobuttonHtml('checkbox','','CheckBox',this.ReadOnly,this.Items,this.NCols);}
CpCheckboxField.prototype.Init=function(forceGetDefault){function GetChangeCallback(self,i){return function(e){self.OnChange(e,i);};}
function GetTextClickCallback(self,i){return function(e){self.OnTextClick(e,i);};}
forceGetDefault=xDefBool(forceGetDefault,false);var nItems=this.Items.length;for(var i=0;i<nItems;i++){var item=this.Items[i];var cbDomObj=xGet(item.HtmlID);if(!item.ReadOnly){item.CheckboxChangeHandler=GetChangeCallback(this,i);xAddEvent(cbDomObj,'change',item.CheckboxChangeHandler);xAddEvent(cbDomObj,'click',item.CheckboxChangeHandler);var clickArea=this.Panel.GetFieldCell(cbDomObj);if(clickArea){item.CellClickHandler=GetTextClickCallback(this,i);xAddEvent(clickArea,'click',item.CellClickHandler);}}
item.DomObj=cbDomObj;if(!item.ValidDefault||forceGetDefault){item.Default=this.ValueFromModel(item.ValueRef);item.ValidDefault=true;}
item.ValidLast=false;var enable=this.GetEnabledFromModel(item);this.SetItemGuiEnabled(item,enable,true);}}
CpCheckboxField.prototype.Invalidate=function(){this.ForEachItem(function(item,i){item.ValidLast=false;});}
CpCheckboxField.prototype.Reset=function(bCallModelChangeCB){this.ForEachItem(function(item,i){if(item.ReadOnly)return;item.ValidLast=false;this.ValueToModel(item.Default,item.ValueRef,false,bCallModelChangeCB);});}
CpCheckboxField.prototype.Update=function(){var nItems=this.Items.length;for(var i=0;i<nItems;i++){var item=this.Items[i];var v=this.ValueFromModel(item.ValueRef);if(!(item.ValidLast&&v==item.LastValue)){if(item.DomObj)item.DomObj.checked=v;item.LastValue=v;item.ValidLast=true;}
var enable=this.GetEnabledFromModel(item);this.SetItemGuiEnabled(item,enable);}}
ControlPanel.prototype.AddRadiobuttonField=function(aParams){return this.AddField(new CpRadiobuttonField(this,aParams));}
function CpRadiobuttonField(aPanel,aParams){aParams=xDefObj(aParams,{});this.parentClass.constructor.call(this,aPanel,aParams);this.ValueType=xDefStr(aParams.ValueType,'str');this.Items=[];if(xArray(aParams.Items)){var itemsDef=aParams.Items;var nItemsDef=itemsDef.length;for(var i=0;i<nItemsDef;i++){var itemDef=itemsDef[i];if(itemDef){var item={};item.Name=xDefStr(itemDef.Name,this.Name+'-'+i);item.HtmlID=this.HtmlID+'-'+i;if(xDef(itemDef.Value)){item.Value=this.ToValueStr(itemDef.Value,this.ValueType);}else{item.Value=item.Name;}
item.Text=xDefStr(itemDef.Text,item.Name);item.DomObj=null;item.RadionbuttonChangeHandler=null;this.Items.push(item);}}}
this.NCols=xDefNum(aParams.NCols,this.Items.length);this.LastValue='';this.ValidLast=false;}
CpRadiobuttonField.inheritsFrom(CpField);CpRadiobuttonField.prototype.GetType=function(){return'RadiobuttonField';}
CpRadiobuttonField.prototype.Free=function(){xArrForEach(this.Items,function(item,i){var rbDomObj=item.DomObj;if(!this.ReadOnly&&rbDomObj&&item.RadiobuttonChangeHandler){xRemoveEvent(rbDomObj,'change',item.RadiobuttonChangeHandler);xRemoveEvent(rbDomObj,'click',item.RadiobuttonChangeHandler);var clickArea=this.Panel.GetFieldCell(rbDomObj);if(clickArea){xRemoveEvent(clickArea,'click',item.RadiobuttonChangeHandler);}}
item.DomObj=null;},this);this.parentClass.Free.call(this);}
CpRadiobuttonField.prototype.ForEachItem=function(func){xArrForEach(this.Items,func,this);}
CpRadiobuttonField.prototype.GetItem=function(aName){var item=xArrFind(this.Items,function(item){return item.Name==aName;});return item?item:null;}
CpRadiobuttonField.prototype.ParseDataType=function(aValue,aDataType){var v=aValue;if(aDataType=='int'){v=parseInt(v,10);if(isNaN(v))v=0;}else if(aDataType=='num'){v=parseFloat(v);if(isNaN(v))v=0.0;}else if(aDataType=='bool'){v=(aValue!=''&&aValue!='0'&&aValue!='false');}
return v;}
CpRadiobuttonField.prototype.ToValueStr=function(aValue,aDataType){var v=aValue;if(xStr(v)){if(aDataType=='int'){v=this.ParseDataType(aValue,aDataType).toString();}else if(aDataType=='num'){v=parseFloat(aValue);v=(IsNaN(v))?'0.0':aValue;}else if(aDataType=='bool'){v=(aValue!=''&&aValue!='0'&&aValue!='false');v=(v)?'true':'false';}}else{if(aDataType=='int'){v=xNum(aValue)?v.toFixed(0):'0';}else if(aDataType=='num'){v=xNum(aValue)?v.toString():'0.0';}else if(aDataType=='bool'){v=aValue?'true':'false';}else{v=aValue.toString();}}
return v;}
CpRadiobuttonField.prototype.GetEnabledFromModel=function(){if(this.EnabledRef)return this.ValueFromModel(this.EnabledRef);return this.Enabled;}
CpRadiobuttonField.prototype.SetGuiEnabled=function(enabled,force){var force=xDefBool(force,false);var fieldCellId=this.HtmlID;if(enabled){if(this.Enabled&&!force)return;this.ForEachItem(function(item,i){xRemoveClass(fieldCellId+'-'+i+'-Field','Disabled');});this.Enabled=true;}else{if(!this.Enabled&&!force)return;this.ForEachItem(function(item,i){xAddClass(fieldCellId+'-'+i+'-Field','Disabled');});this.Enabled=false;}}
CpRadiobuttonField.prototype.OnChange=function(aEvent,aRadioIx){aEvent.StopPropagation();if(!this.Enabled){aEvent.PreventDefault();this.ValidLast=false;this.Update();return;}
var item=this.Items[aRadioIx];var v=this.ParseDataType(item.Value,this.ValueType);this.ValueToModel(v,this.ValueRef,false,true);}
CpRadiobuttonField.prototype.GetHtml=function(){return this.Panel.CheckboxOrRadiobuttonHtml('radio',this.Name,'Radio',this.ReadOnly,this.Items,this.NCols);}
CpRadiobuttonField.prototype.GetHtmlID=function(itemIx){if(!xNum(itemIx))return this.HtmlID;if(itemIx<0||itemIx>=this.Items.length)return'';return this.Items[itemIx].HtmlID;}
CpRadiobuttonField.prototype.GetDomObj=function(itemIx){if(!xNum(itemIx))return null;if(itemIx<0||itemIx>=this.Items.length)return null;return this.Items[itemIx].DomObj;}
CpRadiobuttonField.prototype.Init=function(forceGetDefault){function GetChangeHandler(self,i){return function(e){self.OnChange(e,i);};}
forceGetDefault=xDefBool(forceGetDefault,false);if(!this.ValidDefault||forceGetDefault){this.Default=this.ValueFromModel(this.ValueRef);this.ValidDefault=true;}
var nItems=this.Items.length;for(var i=0;i<nItems;i++){var item=this.Items[i];var rbDomObj=xGet(item.HtmlID);if(!this.ReadOnly){item.RadiobuttonChangeHandler=GetChangeHandler(this,i);xAddEvent(rbDomObj,'change',item.RadiobuttonChangeHandler);xAddEvent(rbDomObj,'click',item.RadiobuttonChangeHandler);var clickArea=this.Panel.GetFieldCell(rbDomObj);if(clickArea)xAddEvent(clickArea,'click',item.RadiobuttonChangeHandler);}
item.DomObj=rbDomObj;}
var enable=this.GetEnabledFromModel();this.SetGuiEnabled(enable,true);this.ValidLast=false;}
CpRadiobuttonField.prototype.Invalidate=function(){this.ValidLast=false;}
CpRadiobuttonField.prototype.Reset=function(bCallModelChangeCB){if(this.ReadOnly)return;this.ValidLast=false;this.ValueToModel(this.Default,this.ValueRef,false,bCallModelChangeCB);}
CpRadiobuttonField.prototype.Update=function(){var v=this.ValueFromModel(this.ValueRef);if(!(this.ValidLast&&v==this.LastValue)){this.LastValue=v;this.ValidLast=true;var nItems=this.Items.length;for(var i=0;i<nItems;i++){var ov=this.ParseDataType(this.Items[i].Value,this.ValueType);if(v==ov){var domObj=this.Items[i].DomObj;if(domObj)domObj.checked=true;break;}}}
var enable=this.GetEnabledFromModel();this.SetGuiEnabled(enable);}
ControlPanel.prototype.AddValueSliderField=function(aParams){if(!xDef(aParams))aParams={};var valuePos=xDefStr(this.ValuePos,'left');aParams.IsValueSlider=true;if(valuePos=='right'){this.AddSliderField(aParams);aParams.ColSpan=2;var textField=new CpTextField(this,aParams);textField.ValueClass='Value SliderValue';this.AddField(textField);}else{var textField=new CpTextField(this,aParams);textField.ValueClass='Value SliderValue';this.AddField(textField);aParams.ColSpan=2;this.AddSliderField(aParams);}
return this;}
ControlPanel.prototype.AddSliderField=function(aParams){return this.AddField(new CpSliderField(this,aParams));}
function CpSliderField(aPanel,aParams){aParams=xDefObj(aParams,{});this.parentClass.constructor.call(this,aPanel,aParams);this.HtmlID+='-Slider'
if(!xStr(aParams.ValueClass))this.ValueClass='Value Slider';if(xStr(aParams.SliderValueRef)){this.ValueRef=aPanel.MakeRef(aParams.SliderValueRef,this.Name);}
if(aParams.IsValueSlider){this.ReadOnly=xDefBool(aParams.SliderReadOnly,false);}
this.Caption=xDefStr(aParams.Caption,'&hArr;');this.Min=xDefNum(aParams.Min,0);this.Max=xDefNum(aParams.Max,1);this.Steps=xDefNum(aParams.Steps,0);this.Rounding=xDefStr(aParams.Rounding,'none');this.BorderWidth=xDefNum(aParams.BorderWidth,1);this.Color=xDefStr(aParams.Color,'');this.DgdSlider=null;this.LastValue=0;this.LastSliderPos=-1;}
CpSliderField.inheritsFrom(CpField);CpSliderField.prototype.Free=function(){this.DgdSlider.free();this.DgdSlider=null;this.parentClass.Free.call(this);}
CpSliderField.prototype.GetType=function(){return'SliderField';}
CpSliderField.prototype.GetEnabledFromModel=function(){if(this.EnabledRef)return this.ValueFromModel(this.EnabledRef);return this.Enabled;}
CpSliderField.prototype.SetGuiEnabled=function(enabled,force){if(enabled){if(this.Enabled&&!force)return;if(this.DgdSlider&&!this.ReadOnly)this.DgdSlider.enable();this.Enabled=true;}else{if(!this.Enabled&&!force)return;if(this.DgdSlider&&!this.ReadOnly)this.DgdSlider.disable();this.Enabled=false;}}
CpSliderField.prototype.GetHtml=function(){return DgdSliderHtml(this.HtmlID,this.Caption,this.Color);}
CpSliderField.prototype.Init=function(forceGetDefault){forceGetDefault=xDefBool(forceGetDefault,false);var self=this;var options={};if(this.BorderWidth>0){options.right=2*this.BorderWidth;}
if(this.Steps>0){options.steps=this.Steps+1;options.snap=true;}
options.animationCallback=function(x,y){self.OnSliderChange(x,y);}
this.DgdSlider=new DgdSlider(this.HtmlID,options);this.DomObj=xGet(this.HtmlID);if(this.ReadOnly){this.DgdSlider.readonly();xAddClass(this.DomObj,'ReadOnly');if(this.Caption=='&hArr;'){xInnerHTML(this.HtmlID+'-Handle','|');}}
if(!this.ValidDefault||forceGetDefault){this.Default=this.ValueFromModel(this.ValueRef);this.ValidDefault=true;}
var enable=this.GetEnabledFromModel();this.SetGuiEnabled(enable,true);}
CpSliderField.prototype.Invalidate=function(){this.LastSliderPos=-1;}
CpSliderField.prototype.Reset=function(bCallModelChangeCB){if(this.ReadOnly)return;this.ValueToModel(this.Default,this.ValueRef,false,bCallModelChangeCB);}
CpSliderField.prototype.OnSliderChange=function(x,y){if(!this.DgdSlider||this.ReadOnly)return;var v=x*(this.Max-this.Min)+this.Min;if(this.Rounding=='floor'){v=Math.floor(v);}else if(this.Rounding=='round'){v=Math.round(v);}
if(v<this.Min)v=this.Min;if(v>this.Max)v=this.Max;this.LastValue=v;this.LastSliderPos=x;this.ValueToModel(v,this.ValueRef,false,true);}
CpSliderField.prototype.Update=function(){if(!this.DgdSlider)return;var v=this.ValueFromModel(this.ValueRef);if(this.LastSliderPos==-1||this.LastValue!=v){var x=(v-this.Min)/(this.Max-this.Min);if(x<0)x=0;if(x>1)x=1;this.DgdSlider.setValue(x,0,true);this.LastValue=v;this.LastSliderPos=x;}
var enable=this.GetEnabledFromModel();this.SetGuiEnabled(enable);}
CpSliderField.prototype.UpdateLayout=function(visiState){if(!this.DgdSlider||visiState==0)return;this.DgdSlider.updateLayout();if(this.LastSliderPos==-1){this.Update();}else{this.DgdSlider.setValue(this.LastSliderPos,0,true);}}