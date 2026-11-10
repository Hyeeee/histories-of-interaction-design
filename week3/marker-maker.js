// marker-maker.js
// Original ArUco 마커(js-aruco가 읽는 종류)를 숫자 ID로부터 직접 그려주는 작은 도구.
// 7x7 칸: 바깥 한 줄은 전부 검정, 안쪽 5x5 칸이 ID를 담는다.
// 안쪽 한 줄(5칸)은 ID의 2비트를 담고, 정해진 4가지 무늬 중 하나가 된다.

var MarkerMaker = (function () {
  // js-aruco가 쓰는 4가지 줄 무늬 (1 = 흰 칸, 0 = 검은 칸)
  var WORDS = [
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ];

  // ID(0~1023)를 7x7 격자(1 = 흰색, 0 = 검정)로 바꾼다
  function grid(id) {
    var g = [];
    for (var r = 0; r < 7; r++) {
      g.push([0, 0, 0, 0, 0, 0, 0]);
    }
    for (var i = 0; i < 5; i++) {
      var pair = (id >> (8 - 2 * i)) & 3; // 위쪽 줄부터 ID의 2비트씩
      var word = WORDS[pair];
      for (var j = 0; j < 5; j++) {
        g[i + 1][j + 1] = word[j];
      }
    }
    return g;
  }

  // 격자를 SVG 문자열로 (sizeMm = 검은 테두리 포함 한 변 길이, 밀리미터)
  function svg(id, sizeMm) {
    var g = grid(id);
    var cell = sizeMm / 7;
    var quiet = cell; // 바깥에 흰 여백 한 칸 (인식에 꼭 필요)
    var total = sizeMm + quiet * 2;
    var out = '<svg xmlns="http://www.w3.org/2000/svg" width="' + total + 'mm" height="' + total +
      'mm" viewBox="0 0 ' + total + ' ' + total + '">';
    out += '<rect width="' + total + '" height="' + total + '" fill="#fff"/>';
    for (var r = 0; r < 7; r++) {
      for (var c = 0; c < 7; c++) {
        if (g[r][c] === 0) {
          out += '<rect x="' + (quiet + c * cell) + '" y="' + (quiet + r * cell) +
            '" width="' + (cell + 0.02) + '" height="' + (cell + 0.02) + '" fill="#000"/>';
        }
      }
    }
    return out + '</svg>';
  }

  return { grid: grid, svg: svg };
})();

if (typeof module !== 'undefined') { module.exports = MarkerMaker; }
