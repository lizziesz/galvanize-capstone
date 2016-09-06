app.directive('cpShowResults', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/results.html'
  }
});

app.directive('cpAddFaveForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/addfave.html'
  }
})
