var rows = 32;
var cols = 32;

if (Meteor.isClient) {
  
  Template.sheet.helpers({
    currentFormula: function(){
//      return Session.get('currentCell').val;
    },
    render: function(cell){
      if (cell.row === 1 && cell.col === 1)
        return {val:'*', first: true};
      else if (cell.row === 1){
        var buildColName = function(char){
          if (char > 25){
            var mod = char % 25 - 1;
            var div = Math.floor(char/25) - 1;
            return buildColName(div) + String.fromCharCode(65 + mod);
          }
          return String.fromCharCode(65 + char);
        };
        var code = cell.col - 2;
        return {val: buildColName(code), first:true};
      }
      else if (cell.col === 1)
        return {val: cell.row-1, first:true};
      
      return cell;
    },
    row: function(){
      return _.map(_.range(1, rows+1),function(i){
        return {row: i};
      });
    },
    col: function(row){
      return Cells.find({row: row.row});
    }
  });
  
  Template.sheet.events({
    'keyup .cell': function(e){
      var ct = e.currentTarget;
      var col = this.col;
      var row = this.row;
      if (e.which === 13){//[enter] move down a row
        row += e.shiftKey?-1:1;
        ct.value = ct.value.trim();
      }
      if (e.which === 9){//[tab] move to the next cell
        col += e.shiftKey?-1:1;
        ct.value = ct.value.trim();
      }
      if (e.which === 13 || e.which === 9){
        document.querySelector('.row:nth-child('+row+') .cell:nth-child('+col+')').focus();
        e.preventDefault();
      }
      if (e.which === 27){
        ct.blur();
      }
    },
    'focus .cell':function(e){
      if (this.expr){
        e.currentTarget.value = this.expr;
      }
    },
    'blur .cell':function(e){
      var expression = e.currentTarget.value;
      var val = expression;
      if (expression.indexOf("=") === 0){
         val = Parser.parse(expression.substring(1));
      }
      var c = {
        row:this.row,
        col:this.col,
        val:val
      };
      if (expression.indexOf("=") === 0)
        c.expr = expression;
      
      Cells.update({_id:this._id}, c);
      
      e.currentTarget.value = val;
    }
  });

}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var cells = Cells.find({});
    if (cells.count() === 0){
      for (var i = 1; i <= cols; i++) {
        for (var j = 1; j <= cols; j++) {
          Cells.insert({
            row: i,
            col: j,
            val: ''
          });
        }
      }
    }
  });
}
