/*!
Copyright (c) 2009 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/
var ThumbSlides = new Class({
	Implements : Options,
	list : $empty,
	listClass : ['thumbs-list'],
	options : {
		thumbSize : 48,
		parent : $empty,
		movement : false
	},
	thumbsList :$empty,
	liMargins : 4,
	list_width : 0,
	subContainer : $empty,
	rightButton : $empty,
	leftButton : $empty,
	buttonsSize : $empty,
	containerSize : $empty,
	last : false,
	rowWidht : 0,
	initialize : function(list,options){
		this.setOptions(options);
		this.setBox();
		
		if ($type($(list))=== 'element'){
			this.list=list;
			this.generateBox();
		}
		else this.generateFromJSON(list);
		
		if (this.options.parent == $empty){
			this.options.parent = $$('body')[0];
		}
		this.options.parent.adopt(this.container);
	},
	setBox : function(){
		
		this.subContainer = new Element('div',{'class':'subcontainer'}),
		this.leftButton = new Element('button',{'class':'leftButton','disabled':'disabled'}),
		this.rightButton = new Element('button',{'class':'rightButton'}),
		this.container = new Element('div',{'class':'list-container'});
		
		var old_left = this.subContainer.getStyle('left'),
			old_position = this.subContainer.getStyle('position');
		
		this.subContainer.setStyles({
			'position':'absolute',
			'left':-9999
		})
		$$('body')[0].adopt(this.subContainer);
		this.rowWidth = this.subContainer.getSize().x.toInt();
		this.subContainer.setStyles({
			'position' : old_position,
			'left':old_left
		});

		this.container.adopt(this.leftButton,this.subContainer,this.rightButton).setStyle('visibility','hidden');
		this.thumbsList = new Element('ul',{'class':this.listClass});
		this.buttonsSize = this.leftButton.getSize();
		this.containerSize = this.container.getSize();
		
		this.subContainer.adopt(this.thumbsList);
	},
	getThumbs : function(){
		var anchors = this.list.getElements('a');
		var list =[];
		anchors.each(function(a){list.push(new this.Thumb(a));});
		return list;
	},
	generateBox : function(){
		var self = this,
			lic =0,
			lis = this.list.getElements('li'),
			subContainer = this.subContainer;
		
		if (this.options.parent === $empty)
			this.options.parent = this.list.getParent()
		
		lis.each(function(li){
			var a = li.getElements('a')[0], 
				img = a.getElements('img')[0],
				targetImage = a.get('href'),
				desc = img.get('alt');
			self.thumbsList.adopt(li.adopt(a));
			lic++;
		});

		this.list.destroy();
		
		this.setEvents(lic);
	},
	setEvents : function(li_count){
		var self=this,
			lis = this.container.getElements('li'),
			rightButton = this.rightButton,
			leftButton = this.leftButton,
			subContainer = this.subContrainer;
			
		self.liMargins = lis[0].getStyle('margin-right').toInt()+lis[0].getStyle('margin-left').toInt();
		
		this.list_width = li_count * (self.options.thumbSize + self.liMargins ); 

		width_dif = this.list_width % self.rowWidth + (self.options.thumbSize + self.liMargins) ;//if the list width dosent exactly fit the container
		
		self.thumbsList.setStyle('width',this.list_width);
		
		rightButton.addEvent('click',function(){
			self.next(self.options.movement);
		});
		
		leftButton.addEvent('click',function(){
			self.prev(self.options.movement);
		});
		
		self.container.setStyle('visibility','visible');
	},
	Thumb : new Class({
		initialize : function(a){
			this.targetImage = a.get('href');
			var img = a.getElements('img')[0];
			this.thumb = img.get('src');
			this.description = img.get('alt');
		}
	}),
	generateFromJSON : function(json){
		var self = this;
		json.each(function(jsn){
			var li = new Element('li'),
				a  = new Element('a',{href:jsn.source,'class':'smoothbox'}),
				
				img = new Element('img',{
					src    : jsn.url,
					width  : jsn.width,
					height : jsn.height,
					alt    : jsn.description,
					title  : jsn.description
				});
			li.adopt(a.adopt(img));
			self.thumbsList.adopt(li);
		});
		this.setEvents(json.length);
	},
	next : function(thumb_number){
		var self=this, 
			width_dif = this.list_width % self.rowWidth + (self.options.thumbSize + self.liMargins),
			left = self.thumbsList.getStyle('left').toInt(), 
			size = self.thumbsList.getSize(),
			movement = (left-this.rowWidth-width_dif<=-1*(size.x)) ? self.rowWidth - width_dif : self.rowWidth;
		
		if (thumb_number){
			movement = ((this.options.thumbSize + this.liMargins) * thumb_number);
			if (left-movement<-1*size.x+this.rowWidth){
				movement = size.x-this.rowWidth+left;
			};
		}

		if (left>-1*(size.x-self.rowWidth)){
			self.thumbsList.tween('left',left-movement);
				
			if (this.leftButton.get('disabled')) this.leftButton.removeClass('disabled').removeAttribute('disabled');
			if (movement<self.rowWidth && typeof(thumb_number) == 'undefiend'){
				self.last = true;
				this.rightButton.set('disabled','disabled');
			}
		}
	},
	prev : function(thumb_number){
		var self=this, 
			width_dif = this.list_width % self.rowWidth + (self.options.thumbSize + self.liMargins)
			left = self.thumbsList.getStyle('left').toInt(), 
			size = self.thumbsList.getSize(),
			movement = (self.last) ? self.rowWidth-width_dif : self.rowWidth;
		
		if (thumb_number){
			movement = ((this.options.thumbSize + this.liMargins) * thumb_number);
			if (left+movement>0){
				movement = movement-(left+movement);
			};
		}

		if (left<0){
			self.thumbsList.tween('left',left+movement);
			
			if (this.rightButton.get('disabled')) this.rightButton.removeClass('disabled').removeAttribute('disabled');
			if (this.last) this.last = false;
			if (left==this.buttonsSize.x){
				this.set('disabled','disabled');
			}
		}
	}
})