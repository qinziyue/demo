var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})

var ordersVue = new Vue({
  el: "#order-list",

  data: {
    orders: [],
	askArr: [],
	bidArr: []  
  },

  init: this.fetchOrders,

  ready: function() {
  	this.fetchOrders();
    
  },

  methods: {
    fetchOrders: function() {
      var self = this;
      $.ajax({
	    type: "GET",
	    url: "/listOrders",
	    dataType: "json",
	    data: {
          "start": "0",
          "size": "100"
        },
	    success: function(resp) {
			self.rsapHandle(resp);		
//	      	self.orders = resp;
	    },
	    error: function(jqXHR, exception) {
	      console.log("Failed to get chain height!");
          self.orders = [];
	    }
      });
    },
	rsapHandle: function(data){
		var self = this;
		data.forEach(function(order){
			if(order.side == 'ask'){
				self.askArr.push(order)
			}else{
				self.bidArr.push(order)
			};
		});
		self.askArr.sort(self.sortFun('price','quantity'));
		self.bidArr.sort(self.sortFun('price','quantity'));
		self.askArr.reverse();
		self.bidArr.reverse();
		self.askArr.length = self.bidArr.length = 20;
		self.orders = self.askArr.concat(self.bidArr)
	},
	sortFun: function (price,num){
		return function(frontObj,behindObj){
			var frontPrice = Number(frontObj.price),
				frontNum = Number(frontObj.number),
				behindPrice = Number(behindObj.price),
				behindNum = Number(behindObj.number);
			if(frontPrice > behindPrice){
				return 1
			}else if(frontPrice < behindPrice){
				return -1
			}else{
				if(frontNum > behindNum){
					return 1
				}else if(frontNum < behindNum){
					return -1
				}else{
					return 0
				}
			}
		}	
	}  
  }
});

(function reset() {
  $.ajax({
	type: "GET",
	url: "/reset"
  })
})();
