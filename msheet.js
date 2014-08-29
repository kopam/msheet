var rows = 32;
var cols = 32;

if (Meteor.isClient) {
  Session.set('currentCell', '');
  Template.sheet.helpers({
      currentFormula: function(){
          return Session.get('currentCell');
      },
      row: function(){
          return _.map(_.range(1, rows+1), function(i){
              return {i: i};
          });
      },
      col: function(){
          return _.map(_.range(1, cols+1), function(i){
              return {i: i};
          });
      }
  });
  
  Template.sheet.events({
      'focus .cell': function(e){
          Session.set('currentCell', e.currentTarget.innerText);
      },
      'keypress .cell': function(e){
          var ct = e.currentTarget;
          var currentCol = ct.dataset.index * 1;
          var col = currentCol;
          var currentRow = ct.parentNode.dataset.index * 1;
          var row = currentRow;
          if (e.keyCode === 13){//[enter] move down a row
            row += e.shiftKey?-1:1;
            ct.innerText = ct.innerText.trim();
          }
          if (e.keyCode === 9){//[tab] move to the next cell
            col += e.shiftKey?-1:1;
            ct.innerText = ct.innerText.trim();
          }
          document.querySelector('.row:nth-child('+row+') .cell:nth-child('+col+')').focus();
      }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
