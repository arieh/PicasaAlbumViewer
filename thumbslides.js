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
	options : {thumbSize : 48},
	thumbsList :$empty,
	liMargins : 4,
	buttonsSize : $empty,
	containerSize : $empty,
	initialize : function(el,options){
		this.list=el;
		
		this.setOptions(options);
		this.generateBox();
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
			parent = this.list.getParent(),
			list_width,
			subContainer = new Element('div',{'class':'subcontainer'}),
			leftButton = new Element('button',{'class':'leftButton','disabled':'disabled'}),
			rightButton = new Element('button',{'class':'rightButton'}),
			rowWidth,
			last=false;
		
		this.container = new Element('div',{'class':'list-container'});
		
		this.container.adopt(leftButton,subContainer,rightButton).setStyle('visibility','hidden');
		parent.adopt(this.container);
		self.buttonsSize = leftButton.getSize();
		self.containerSize = self.container.getSize();
		rowWidth = subContainer.getSize().x;
		
		
		this.thumbsList = new Element('ul',{'class':this.listClass});

		subContainer.adopt(self.thumbsList);
		
		lis.each(function(li){
			var a = li.getElements('a')[0], 
				img = a.getElements('img')[0],
				targetImage = a.get('href'),
				desc = img.get('alt');
			self.thumbsList.adopt(li.adopt(a));
			lic++;
		});

		this.list.destroy();
		self.liMargins = lis[0].getStyle('margin-right').toInt()+lis[0].getStyle('margin-left').toInt();
		
		list_width = lic * (self.options.thumbSize + self.liMargins ); 
		var width_dif = list_width % rowWidth + (self.options.thumbSize + self.liMargins) ;//if the list width dosent exactly fit the container
		
		self.thumbsList.setStyle('width',list_width);
		
		rightButton.addEvent('click',function(){
			var left = self.thumbsList.getStyle('left').toInt(), 
				size = self.thumbsList.getSize(),
				movement = (left-rowWidth-width_dif<=-1*(size.x)) ? rowWidth - width_dif : rowWidth;
				
			if (left>-1*(size.x-rowWidth)){
				
				self.thumbsList.tween('left',left-movement);
				
				if (leftButton.get('disabled')) leftButton.removeClass('disabled').removeAttribute('disabled');
				if (movement<rowWidth){
					last = true;
					this.set('disabled','disabled');
				}
			}
		});
		
		leftButton.addEvent('click',function(){
			var left = self.thumbsList.getStyle('left').toInt(), 
				size = self.thumbsList.getSize(),
				movement = (last) ? rowWidth-width_dif : rowWidth;

			if (left<0){
				self.thumbsList.tween('left',left+movement);
				
				if (rightButton.get('disabled')) rightButton.removeClass('disabled').removeAttribute('disabled');
				if (last) last = false;
				if (left==self.buttonsSize.x){
					this.set('disabled','disabled');
				}
			}
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
	})
})