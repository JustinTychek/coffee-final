var MODEL = (function () {
  var _getPageContent = function (pageName) {
    $.get(`pages/${pageName}/${pageName}.html`, function (data) {
      $("#app").html(data);
      //   console.log("getting content");
    });
  };

  return {
    getPageContent: _getPageContent,
  };
})();
