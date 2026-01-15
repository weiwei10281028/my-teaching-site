moleculeHistory = [];
function getCurrentMoleculeName() {
  if (!window["\x63\x75\x72\x72\x65\x6e\x74\x4d\x6f\x6c\x65\x63\x75\x6c\x65"] || !window["\x63\x75\x72\x72\x65\x6e\x74\x4d\x6f\x6c\x65\x63\x75\x6c\x65"]["\x66\x75\x6c\x6c\x4b\x65\x79"]) return "";
  const _0x4b44cc = currentMolecule["\x66\x75\x6c\x6c\x4b\x65\x79"]["\x73\x70\x6c\x69\x74"]("\x7c");
  return _0x4b44cc["\x6c\x65\x6e\x67\x74\x68"] > 0x1 ? _0x4b44cc[0x1]["\x74\x72\x69\x6d"]() : _0x4b44cc[0x0]["\x74\x72\x69\x6d"]();
}
function checkReactionAvailable(_0x4b7317) {
  const _0x1ad983 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x63\x6f\x6e\x74\x61\x69\x6e\x65\x72"),
    _0x5d3d49 = document["\x71\x75\x65\x72\x79\x53\x65\x6c\x65\x63\x74\x6f\x72"]("\x2e\x72\x65\x73\x65\x74\x2d\x62\x74\x6e"),
    _0x359df6 = document["\x71\x75\x65\x72\x79\x53\x65\x6c\x65\x63\x74\x6f\x72\x41\x6c\x6c"]("\x2e\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x62\x74\x6e");
  (_0x359df6["\x66\x6f\x72\x45\x61\x63\x68"]((_0x4960fd) => (_0x4960fd["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x6e\x6f\x6e\x65")), (_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x6e\x6f\x6e\x65"), (_0x5d3d49["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x6e\x6f\x6e\x65"));
  const _0x54686d = getCurrentMoleculeName();
  if (_0x54686d === "\u4e59\u70ef")
    ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"),
      ["\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x68\x32\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x68\x63\x6c\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x63\x6c\x32\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x6b\x6d\x6e\x6f\x34\x2d\x62\x74\x6e"]["\x66\x6f\x72\x45\x61\x63\x68"]((_0x5a932e) => {
        const _0x30fd6a = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"](_0x5a932e);
        if (_0x30fd6a) _0x30fd6a["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
      }));
  else {
    if (_0x54686d === "\u4e19\u70ef")
      ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"),
        ["\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x70\x72\x6f\x70\x65\x6e\x65\x2d\x68\x32\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x70\x72\x6f\x70\x65\x6e\x65\x2d\x63\x6c\x32\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x70\x72\x6f\x70\x65\x6e\x65\x2d\x68\x63\x6c\x2d\x62\x74\x6e", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x70\x72\x6f\x70\x65\x6e\x65\x2d\x68\x32\x6f\x2d\x62\x74\x6e"]["\x66\x6f\x72\x45\x61\x63\x68"]((_0x16a1b8) => {
          const _0xe9da3a = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"](_0x16a1b8);
          if (_0xe9da3a) _0xe9da3a["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
        }));
    else {
      if (_0x54686d === "\u4e19\u7094")
        ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"),
          ["\x62\x74\x6e\x2d\x63\x33\x68\x34\x2d\x68\x32\x2d\x66\x75\x6c\x6c", "\x62\x74\x6e\x2d\x63\x33\x68\x34\x2d\x68\x32\x2d\x70\x61\x72\x74"]["\x66\x6f\x72\x45\x61\x63\x68"]((_0x37455e) => {
            const _0x5c0d0a = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"](_0x37455e);
            if (_0x5c0d0a) _0x5c0d0a["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
          }));
      else {
        if (_0x54686d === "\u4e59\u7094")
          ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"),
            ["\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x68\x32\x2d\x66\x75\x6c\x6c", "\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x68\x32\x2d\x70\x61\x72\x74", "\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x63\x6c\x32\x2d\x66\x75\x6c\x6c", "\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x63\x6c\x32\x2d\x70\x61\x72\x74", "\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x68\x63\x6c\x2d\x66\x75\x6c\x6c", "\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x68\x63\x6c\x2d\x70\x61\x72\x74", "\x62\x74\x6e\x2d\x63\x32\x68\x32\x2d\x68\x32\x6f"][
              "\x66\x6f\x72\x45\x61\x63\x68"
            ]((_0x57e828) => {
              const _0x2e5776 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"](_0x57e828);
              if (_0x2e5776) _0x2e5776["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
            }));
        else {
          if (_0x54686d === "\u7532\u70f7") {
            _0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b";
            const _0x5505bb = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x73\x75\x62\x2d\x62\x74\x6e"),
              _0x47ebbc = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x6e\x69\x74\x72\x6f\x2d\x62\x74\x6e");
            if (_0x5505bb) _0x5505bb["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
            if (_0x47ebbc) _0x47ebbc["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
          } else {
            if (_0x54686d === "\u4e59\u9187" || _0x54686d === "\u9152\u7cbe") {
              _0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b";
              const _0x509154 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x6f\x78\x2d\x62\x74\x6e"),
                _0xa69e05 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x6b\x6d\x6e\x6f\x34\x2d\x62\x74\x6e");
              if (_0x509154) _0x509154["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
              if (_0xa69e05) _0xa69e05["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
            } else {
              if (_0x54686d === "\u4e59\u919b") {
                _0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b";
                const _0x46d69f = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x6f\x78\x2d\x62\x74\x6e"),
                  _0x4feb1b = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x72\x65\x64\x2d\x62\x74\x6e");
                if (_0x46d69f) _0x46d69f["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
                if (_0x4feb1b) _0x4feb1b["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
              } else {
                if (_0x54686d === "\u82ef")
                  ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"),
                    ["\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x62\x65\x6e\x7a\x65\x6e\x65\x2d\x68\x61\x6c\x6f", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x62\x65\x6e\x7a\x65\x6e\x65\x2d\x6e\x69\x74\x72\x6f", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x62\x65\x6e\x7a\x65\x6e\x65\x2d\x73\x75\x6c\x66", "\x72\x65\x61\x63\x74\x69\x6f\x6e\x2d\x62\x65\x6e\x7a\x65\x6e\x65\x2d\x61\x6c\x6b\x79\x6c"]["\x66\x6f\x72\x45\x61\x63\x68"]((_0x35675d) => {
                      const _0x19a53c = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"](_0x35675d);
                      if (_0x19a53c) _0x19a53c["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
                    }));
                else
                  _0x54686d === "\u7532\u82ef" &&
                    ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"),
                    ["\x62\x74\x6e\x2d\x74\x6f\x6c\x2d\x68\x61\x6c\x6f\x2d\x72\x69\x6e\x67", "\x62\x74\x6e\x2d\x74\x6f\x6c\x2d\x68\x61\x6c\x6f\x2d\x75\x76", "\x62\x74\x6e\x2d\x74\x6f\x6c\x2d\x6f\x78"]["\x66\x6f\x72\x45\x61\x63\x68"]((_0x42fea2) => {
                      const _0x12cef8 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"](_0x42fea2);
                      if (_0x12cef8) _0x12cef8["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x66\x6c\x65\x78";
                    }));
              }
            }
          }
        }
      }
    }
  }
  moleculeHistory["\x6c\x65\x6e\x67\x74\x68"] > 0x0 && ((_0x1ad983["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"), (_0x5d3d49["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"));
}
function resetReaction() {
  if (moleculeHistory["\x6c\x65\x6e\x67\x74\x68"] === 0x0) return;
  ((isReactionRunning = ![]), (isReactionFinished = ![]));
  const _0x34660f = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x76\x69\x65\x77\x70\x6f\x72\x74\x2d\x73\x75\x62\x74\x69\x74\x6c\x65");
  if (_0x34660f) _0x34660f["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x6e\x6f\x6e\x65";
  const _0x31466a = moleculeHistory["\x70\x6f\x70"]();
  loadMolecule(_0x31466a["\x6b\x65\x79"], _0x31466a["\x76\x61\x72\x69\x61\x6e\x74"]);
}
function finishReaction(_0x36b0fd, _0x56be68, _0x4980b2 = null, _0x4090cf = null) {
  moleculeHistory["\x70\x75\x73\x68"]({ "\x6b\x65\x79": currentKey, "\x76\x61\x72\x69\x61\x6e\x74": currentVariantKey });
  const _0x675952 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x73\x63\x65\x6e\x65\x2d\x72\x6f\x6f\x74");
  (_0x675952["\x63\x6c\x61\x73\x73\x4c\x69\x73\x74"]["\x61\x64\x64"]("\x73\x63\x65\x6e\x65\x2d\x62\x6c\x75\x72\x2d\x6f\x75\x74"),
    setTimeout(() => {
      loadMolecule(_0x36b0fd, _0x4980b2);
      if (_0x4090cf) {
        const _0x2f03e4 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x76\x69\x65\x77\x70\x6f\x72\x74\x2d\x73\x75\x62\x74\x69\x74\x6c\x65");
        if (_0x2f03e4) _0x2f03e4["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x6e\x6f\x6e\x65";
        const _0x4f718c = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x6b\x6e\x6f\x77\x6c\x65\x64\x67\x65\x2d\x63\x61\x72\x64"),
          _0x4c8cf3 = document["\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x42\x79\x49\x64"]("\x6b\x6e\x6f\x77\x6c\x65\x64\x67\x65\x2d\x74\x65\x78\x74");
        _0x4f718c && _0x4c8cf3 && ((_0x4c8cf3["\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c"] = _0x4090cf), (_0x4f718c["\x73\x74\x79\x6c\x65"]["\x64\x69\x73\x70\x6c\x61\x79"] = "\x62\x6c\x6f\x63\x6b"), _0x4f718c["\x63\x6c\x61\x73\x73\x4c\x69\x73\x74"]["\x61\x64\x64"]("\x65\x78\x70\x61\x6e\x64\x65\x64"));
      }
      (_0x675952["\x63\x6c\x61\x73\x73\x4c\x69\x73\x74"]["\x72\x65\x6d\x6f\x76\x65"]("\x73\x63\x65\x6e\x65\x2d\x62\x6c\x75\x72\x2d\x6f\x75\x74"),
        _0x675952["\x63\x6c\x61\x73\x73\x4c\x69\x73\x74"]["\x61\x64\x64"]("\x73\x63\x65\x6e\x65\x2d\x62\x6c\x75\x72\x2d\x69\x6e"),
        setTimeout(() => {
          (_0x675952["\x63\x6c\x61\x73\x73\x4c\x69\x73\x74"]["\x72\x65\x6d\x6f\x76\x65"]("\x73\x63\x65\x6e\x65\x2d\x62\x6c\x75\x72\x2d\x69\x6e"), (isReactionRunning = ![]), (isReactionFinished = !![]), checkReactionAvailable(_0x36b0fd));
        }, 0x5dc));
    }, 0x5dc));
}
function runEthyleneHydration() {
  finishReaction("\x43\x32\x48\x35\x4f\x48", "\u4e59\u9187", null, "\u4e59\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u4e00\u500b\x43\u539f\u5b50\u63a5\x48\uff0c\u53e6\u4e00\u500b\x43\u539f\u5b50\u63a5\x4f\x48\uff0c\u8f49\u8b8a\u6210\u4e59\u9187");
}
function runEthyleneChlorination() {
  finishReaction("\x43\x32\x48\x34\x43\x6c\x32", "\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e59\u70f7", "\x43\x32\x48\x34\x43\x6c\x32\x7c\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e59\u70f7", "\u4e59\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u5169\u500b\x43\u539f\u5b50\u5404\u63a5\x31\u500b\x43\x6c\uff0c\u8f49\u8b8a\u6210\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e59\u70f7\uff0c\u4ea6\u70ba\u6c27\u5316\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0a\u5347\x29");
}
function runEthyleneHydrogenation() {
  finishReaction("\x43\x32\x48\x36", "\u4e59\u70f7", null, "\u4e59\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u5169\u500b\x43\u539f\u5b50\u5404\u63a5\x31\u500b\x48\uff0c\u8f49\u8b8a\u6210\u4e59\u70f7\uff0c\u4ea6\u70ba\u9084\u539f\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0b\u964d\x29");
}
function runEthyleneHydrohalogenation() {
  finishReaction("\x43\x32\x48\x35\x43\x6c", "\u6c2f\u4e59\u70f7", null, "\u4e59\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u4e00\u500b\x43\u539f\u5b50\u63a5\x48\uff0c\u53e6\u4e00\u500b\x43\u539f\u5b50\u63a5\x43\x6c\uff0c\u8f49\u8b8a\u6210\u6c2f\u4e59\u70f7");
}
function runEthyleneOxidation() {
  finishReaction("\x43\x32\x48\x34\x28\x4f\x48\x29\x32", "\u4e59\u4e8c\u9187", "\x43\x32\x48\x34\x28\x4f\x48\x29\x32\x7c\u4e59\u4e8c\u9187\x7c\x31\x2c\x32\x2d\u4e59\u4e8c\u9187", "\u4e59\u70ef\u901a\u5165\u51b7\u7a00\u3001\u4e2d\u6027\u6216\u5fae\u9e7c\u6027\u7684\u904e\u9333\u9178\u9240\u6eb6\u6db2\u4e2d\uff0c\u78b3\u78b3\u96d9\u9375\u65b7\u88c2\uff0c\u767c\u751f\u6c27\u5316\u53cd\u61c9\uff0c\u96d9\u9375\u7684\u5169\u500b\x43\u63a5\u4e0a\x4f\x48\uff0c\u751f\u6210\u4e59\u4e8c\u9187\u3002");
}
function runMethaneSubstitution() {
  finishReaction("\x43\x48\x33\x43\x6c", "\u4e00\u6c2f\u7532\u70f7", null, "\u7532\u70f7\u5176\u4e2d\u4e00\u500b\x43\x2d\x48\u9375\u65b7\u88c2\uff0c\u63a5\u4e0a\x43\x6c\u539f\u5b50\uff0c\u812b\u53bb\u7684\x48\u8207\u53e6\u4e00\u500b\x43\x6c\u539f\u5b50\u7d50\u5408\u6210\x48\x43\x6c\uff0c\u53e6\u6709\u7522\u7269\x48\x43\x6c");
}
function runMethaneNitration() {
  finishReaction("\x43\x48\x33\x4e\x4f\x32", "\u785d\u57fa\u7532\u70f7", null, "\u7532\u70f7\u5176\u4e2d\u4e00\u500b\x43\x2d\x48\u9375\u65b7\u88c2\uff0c\u63a5\u4e0a\x4e\x4f\u2082\uff0c\u70f7\u812b\u53bb\u7684\x48\u8207\u785d\u9178\u812b\u53bb\u7684\x4f\x48\u7d50\u5408\u6210\x48\u2082\x4f");
}
function runPropeneHydrogenation() {
  finishReaction("\x43\x33\x48\x38", "\u4e19\u70f7", null, "\u4e19\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u5169\u500b\u65b7\ud835\udf7f\u9375\u7684\x43\u539f\u5b50\u5404\u63a5\x31\u500b\x48\uff0c\u8f49\u8b8a\u6210\u4e19\u70f7\uff0c\u4ea6\u70ba\u9084\u539f\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0b\u964d\x29");
}
function runPropeneChlorination() {
  finishReaction("\x43\x33\x48\x36\x43\x6c\x32", "\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e19\u70f7", "\x43\x33\x48\x36\x43\x6c\x32\x7c\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e19\u70f7", "\u4e19\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u5169\u500b\u65b7\ud835\udf7f\u9375\u7684\x43\u539f\u5b50\u5404\u63a5\x31\u500b\x43\x6c\uff0c\u8f49\u8b8a\u6210\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e19\u70f7\uff0c\u4ea6\u70ba\u6c27\u5316\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0a\u5347\x29");
}
function runPropeneHydrohalogenation() {
  finishReaction("\x43\x33\x48\x37\x43\x6c", "\x32\x2d\u6c2f\u4e19\u70f7", "\x43\x33\x48\x37\x43\x6c\x7c\x32\x2d\u6c2f\u4e19\u70f7", "\u4e19\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u5169\u500b\u65b7\ud835\udf7f\u9375\u7684\x43\u539f\u5b50\uff0c\u542b\x48\u8f03\u591a\u7684\x43\u9023\u63a5\x48\uff0c\u53e6\u4e00\u500b\x43\x28\u4e2d\u9593\x29\u9023\u63a5\x43\x6c\uff0c\u8f49\u8b8a\u6210\x32\x2d\u6c2f\u4e19\u70f7\x28\u9700\u8003\u616e\u99ac\u6c0f\u898f\u5247\x29");
}
function runPropeneHydration() {
  finishReaction("\x43\x33\x48\x38\x4f", "\x32\x2d\u4e19\u9187", "\x43\x33\x48\x38\x4f\x7c\x32\x2d\u4e19\u9187", "\u4e19\u70ef\u7684\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u5169\u500b\u65b7\ud835\udf7f\u9375\u7684\x43\u539f\u5b50\uff0c\u542b\x48\u8f03\u591a\u7684\x43\u9023\u63a5\x48\uff0c\u53e6\u4e00\u500b\x43\x28\u4e2d\u9593\x29\u9023\u63a5\x4f\x48\uff0c\u8f49\u8b8a\u6210\u7570\u4e19\u9187\x28\u9700\u8003\u616e\u99ac\u6c0f\u898f\u5247\x29");
}
function runEthanolMildOxidation() {
  finishReaction("\x43\x48\x33\x43\x48\x4f", "\u4e59\u919b", null, "\u4e59\u9187\u70ba\x31\u7d1a\u9187\uff0c\u63a5\x4f\u7684\x43\u4e0a\u5177\u6709\x48\uff0c\u4e00\u822c\u6c27\u5316\u5291\u6703\u5148\u5c07\u4e59\u9187\u6c27\u5316\u6210\u4e59\u919b");
}
function runEthanolStrongOxidation() {
  finishReaction("\x43\x32\x48\x34\x4f\x32", "\u4e59\u9178", "\x43\x48\x33\x43\x4f\x4f\x48\x7c\u4e59\u9178", "\u4e59\u9187\u70ba\x31\u7d1a\u9187\uff0c\u63a5\x4f\u7684\x43\u4e0a\u5177\u6709\x48\uff0c\u7531\u65bc\u904e\u9333\u9178\u9240\u6c27\u5316\u529b\u8f03\u5f37\uff0c\u6545\u4e59\u9187\u76f4\u63a5\u6c27\u5316\u6210\u4e59\u9178");
}
function runAcetaldehydeOxidation() {
  finishReaction("\x43\x32\x48\x34\x4f\x32", "\u4e59\u9178", "\x43\x48\x33\x43\x4f\x4f\x48\x7c\u4e59\u9178", "\u4e59\u919b\u63a5\x4f\u7684\x43\u4e0a\u5177\u6709\x48\uff0c\u7d93\u904e\u6c27\u5316\u53ef\u4ee5\u5f62\u6210\u4e59\u9178");
}
function runAcetaldehydeReduction() {
  finishReaction("\x43\x32\x48\x35\x4f\x48", "\u4e59\u9187", null, "\u919b\u985e\u53ef\u4ee5\u9084\u539f\uff0c\u8b8a\u56de\x31\u7d1a\u9187\uff0c\u4e59\u919b\u9084\u539f\u5f8c\u5f62\u6210\u4e59\u9187");
}
function runAcetyleneFullHydrogenation() {
  finishReaction("\x43\x32\x48\x36", "\u4e59\u70f7", null, "\u4e59\u7094\u7684\u5169\u500b\u78b3\u78b3\ud835\udf7f\u9375\u5168\u6578\u6253\u65b7\uff0c\u53c3\u9375\u5169\u7aef\u7684\x43\u539f\u5b50\u5404\u63a5\u4e0a\x32\u500b\x48\uff0c\u8f49\u8b8a\u6210\u98fd\u548c\u7684\u4e59\u70f7\uff0c\u4ea6\u70ba\u9084\u539f\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0b\u964d\x29\u3002");
}
function runAcetylenePartialHydrogenation() {
  finishReaction("\x43\x32\x48\x34", "\u4e59\u70ef", null, "\u4e59\u7094\u7684\u5176\u4e2d\u4e00\u500b\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u53c3\u9375\u5169\u7aef\u7684\x43\u539f\u5b50\u5404\u63a5\u4e0a\x31\u500b\x48\uff0c\u8f49\u8b8a\u6210\u4e59\u70ef\uff0c\u6b64\u70ba\u63a7\u5236\u689d\u4ef6\u4e0b\u7684\u90e8\u5206\u9084\u539f\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0b\u964d\x29\u3002");
}
function runAcetyleneFullHalogenation() {
  finishReaction(
    "\x43\x32\x48\x32\x43\x6c\x34",
    "\x31\x2c\x31\x2c\x32\x2c\x32\x2d\u56db\u6c2f\u4e59\u70f7",
    "\x43\x32\x48\x32\x43\x6c\x34\x7c\x31\x2c\x31\x2c\x32\x2c\x32\x2d\u56db\u6c2f\u4e59\u70f7",
    "\u4e59\u7094\u7684\u5169\u500b\u78b3\u78b3\ud835\udf7f\u9375\u5168\u6578\u6253\u65b7\uff0c\u53c3\u9375\u5169\u7aef\u7684\x43\u539f\u5b50\u5404\u63a5\u4e0a\x32\u500b\x43\x6c\uff0c\u8f49\u8b8a\u6210\x31\x2c\x31\x2c\x32\x2c\x32\x2d\u56db\u6c2f\u4e59\u70f7\uff0c\u4ea6\u70ba\u6c27\u5316\u53cd\u61c9\x28\x43\u6c27\u5316\u6578\u4e0a\u5347\x29\u3002",
  );
}
function runAcetylenePartialHalogenation() {
  finishReaction(
    "\x43\x32\x48\x32\x43\x6c\x32",
    "\u53cd\x2d\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e59\u70ef",
    "\x43\x32\x48\x32\x43\x6c\x32\x7c\u53cd\x2d\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e59\u70ef",
    "\u4e59\u7094\u7684\u5176\u4e2d\u4e00\u500b\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u53c3\u9375\u5169\u7aef\u7684\x43\u539f\u5b50\u5404\u63a5\u4e0a\x31\u500b\x43\x6c\uff0c\u8f49\u8b8a\u6210\x31\x2c\x32\x2d\u4e8c\u6c2f\u4e59\u70ef\x28\u5f9e\u53cd\u61c9\u6a5f\u69cb\u53ef\u77e5\u4e3b\u7522\u7269\u70ba\u53cd\u5f0f\x29\u3002",
  );
}
function runAcetyleneFullHydrohalogenation() {
  finishReaction(
    "\x43\x32\x48\x34\x43\x6c\x32",
    "\x31\x2c\x31\x2d\u4e8c\u6c2f\u4e59\u70f7",
    "\x43\x32\x48\x34\x43\x6c\x32\x7c\x31\x2c\x31\x2d\u4e8c\u6c2f\u4e59\u70f7",
    "\u4e59\u7094\u8207\u8db3\u91cf\u9e75\u5316\u6c2b\u53cd\u61c9\uff0c\u5169\u500b\u78b3\u78b3\ud835\udf7f\u9375\u5168\u6578\u6253\u65b7\u3002\u4f9d\u99ac\u6c0f\u898f\u5247\uff0c\u5169\u500b\x43\x6c\u539f\u5b50\u6703\u63a5\u5728\u540c\u4e00\u500b\x43\u539f\u5b50\u4e0a\uff0c\u8f49\u8b8a\u6210\x31\x2c\x31\x2d\u4e8c\u6c2f\u4e59\u70f7\u3002",
  );
}
function runAcetylenePartialHydrohalogenation() {
  finishReaction("\x43\x32\x48\x33\x43\x6c", "\u6c2f\u4e59\u70ef", "\x43\x32\x48\x33\x43\x6c\x7c\u6c2f\u4e59\u70ef", "\u4e59\u7094\u7684\u5176\u4e2d\u4e00\u500b\u78b3\u78b3\ud835\udf7f\u9375\u6253\u65b7\uff0c\u4e00\u500b\x43\u63a5\x48\uff0c\u53e6\u4e00\u500b\x43\u63a5\x43\x6c\uff0c\u8f49\u8b8a\u6210\u6c2f\u4e59\u70ef\uff0c\u6b64\u70ba\u805a\u6c2f\u4e59\u70ef\x28\x50\x56\x43\x29\u7684\u91cd\u8981\u55ae\u9ad4\u539f\u6599\u3002");
}
function runAcetyleneHydration() {
  finishReaction("\x43\x48\x33\x43\x48\x4f", "\u4e59\u919b", null, "\u4e59\u7094\u5728\u786b\u9178\u8207\u786b\u9178\u6c5e\x28\x48\x67\x53\x4f\u2084\x29\u50ac\u5316\u4e0b\u8207\u6c34\u52a0\u6210\uff0c\ud835\udf7f\u9375\u65b7\u88c2\u5f8c\u5148\u5f62\u6210\u4e0d\u7a69\u5b9a\u7684\u4e59\u70ef\u9187\uff0c\u96a8\u5373\u767c\u751f\u300e\u919b\u916e\x2d\u70ef\u9187\u4e92\u8b8a\u7570\u69cb\u300f\uff0c\u6c2b\u539f\u5b50\u8f49\u79fb\uff0c\u6700\u7d42\u8f49\u8b8a\u6210\u4e59\u919b\u3002");
}
function runPropyneFullHydrogenation() {
  finishReaction("\x43\x33\x48\x38", "\u4e19\u70f7", null, "\u4e19\u7094\u7684\u5169\u500b\u78b3\u78b3\ud835\udf7f\u9375\u5168\u6578\u6253\u65b7\uff0c\u4e26\u63a5\u4e0a\u8db3\u91cf\u7684\u6c2b\u539f\u5b50\uff0c\u6700\u7d42\u8f49\u8b8a\u6210\u98fd\u548c\u7684\u4e19\u70f7\u3002");
}
function runPropynePartialHydrogenation() {
  finishReaction("\x43\x33\x48\x36", "\u4e19\u70ef", "\x43\x33\x48\x36\x7c\u4e19\u70ef", "\u4e19\u7094\u5728\u63a7\u5236\u689d\u4ef6\u4e0b\uff08\u5982\u4f7f\u7528\u6797\u5fb7\u62c9\u50ac\u5316\u5291\uff09\u50c5\u65b7\u88c2\u4e00\u500b\ud835\udf7f\u9375\uff0c\u52a0\u6210\u4e00\u5206\u5b50\u6c2b\u6c23\u5f8c\u751f\u6210\u4e19\u70ef\u3002");
}
function runBenzeneHalogenation() {
  finishReaction("\x43\x36\x48\x35\x43\x6c", "\u6c2f\u82ef", null, "\u82ef\u8207\u6c2f\u6c23\u5728\u9435\u7c89\x28\u6216\u4e09\u6c2f\u5316\u9435\x29\u50ac\u5316\u4e0b\u767c\u751f\u53d6\u4ee3\u53cd\u61c9\uff0c\u82ef\u74b0\u4e0a\u7684\u4e00\u500b\u6c2b\u88ab\u6c2f\u539f\u5b50\u53d6\u4ee3\uff0c\u751f\u6210\u6c2f\u82ef\uff0c\u53e6\u6709\u7522\u7269\x48\x43\x6c\u3002");
}
function runBenzeneNitration() {
  finishReaction("\x43\x36\x48\x35\x4e\x4f\x32", "\u785d\u57fa\u82ef", null, "\u5728\u6fc3\u786b\u9178\u50ac\u5316\u4e0b\uff0c\u82ef\u74b0\u4e0a\u7684\u6c2b\u539f\u5b50\u88ab\u785d\u57fa\x28\x2d\x4e\x4f\u2082\x29\u53d6\u4ee3\uff0c\u751f\u6210\u7684\u785d\u57fa\u82ef\u662f\u6de1\u9ec3\u8272\u6cb9\u72c0\u6db2\u9ad4\uff0c\u5177\u6709\u7279\u6b8a\u7684\u82e6\u674f\u4ec1\u5473\uff0c\u82ef\u812b\u53bb\u7684\x48\u8207\u785d\u9178\u812b\u53bb\u7684\x4f\x48\u7d50\u5408\u6210\x48\u2082\x4f\u3002");
}
function runBenzeneSulfonation() {
  finishReaction("\x43\x36\x48\x35\x53\x4f\x33\x48", "\u82ef\u78fa\u9178", null, "\u4f7f\u7528\u767c\u7159\u786b\u9178\u6216\u6fc3\u786b\u9178\u52a0\u71b1\uff0c\u82ef\u74b0\u4e0a\u7684\u6c2b\u539f\u5b50\u88ab\u78fa\u9178\u57fa\x28\x2d\x53\x4f\u2083\x48\x29\u53d6\u4ee3\u3002\u7522\u7269\u82ef\u78fa\u9178\u662f\u5f37\u9178\u6027\u7269\u8cea\uff0c\u53ef\u6eb6\u65bc\u6c34\uff0c\u82ef\u812b\u53bb\u7684\x48\u8207\u786b\u9178\u812b\u53bb\u7684\x4f\x48\u7d50\u5408\u6210\x48\u2082\x4f\u3002");
}
function runBenzeneAlkylation() {
  finishReaction("\x43\x37\x48\x38", "\u7532\u82ef", null, "\u5728\u7121\u6c34\u4e09\u6c2f\u5316\u92c1\x28\x41\x6c\x43\x6c\u2083\x29\u50ac\u5316\u4e0b\uff0c\u82ef\u74b0\u4e0a\u7684\u6c2b\u88ab\u7532\u57fa\u53d6\u4ee3\uff0c\u8207\u4e00\u6c2f\u7532\u70f7\u53cd\u61c9\u751f\u6210\u7532\u82ef\uff0c\u662f\u589e\u52a0\u82b3\u9999\u74b0\u78b3\u93c8\u7684\u91cd\u8981\u65b9\u6cd5\uff0c\u53e6\u6709\u7522\u7269\x48\x43\x6c\u3002");
}
function runTolueneHaloRing() {
  finishReaction(
    "\x43\x37\x48\x37\x43\x6c",
    "\u9130\u6c2f\u7532\u82ef",
    "\x43\x37\x48\x37\x43\x6c\x7c\u9130\u6c2f\u7532\u82ef\x7c\x32\x2d\x43\x68\x6c\x6f\x72\x6f\x74\x6f\x6c\x75\x65\x6e\x65",
    "\u7532\u82ef\u8207\u6c2f\u6c23\u5728\x46\x65\u6216\x46\x65\x43\x6c\u2083\u50ac\u5316\u4e0b\uff0c\u7532\u57fa\u7684\u9130\u3001\u5c0d\u4f4d\u96fb\u5b50\u5bc6\u5ea6\u8f03\u9ad8\uff0c\u767c\u751f\u89aa\u96fb\u53d6\u4ee3\u53cd\u61c9\uff0c\u751f\u6210\u9130\u6c2f\u7532\u82ef\uff08\u6216\u5c0d\u6c2f\u7532\u82ef\uff09\u3002",
  );
}
function runTolueneHaloSide() {
  finishReaction("\x43\x37\x48\x37\x43\x6c", "\u6c2f\u5316\u82c4", "\x43\x37\x48\x37\x43\x6c\x7c\u6c2f\u5316\u82c4\x7c\u6c2f\u7532\u82ef\x7c\x42\x65\x6e\x7a\x79\x6c\x20\x63\x68\x6c\x6f\x72\x69\x64\x65", "\u7532\u82ef\u8207\u6c2f\u6c23\u5728\u7d2b\u5916\u5149\x28\x55\x56\x29\u7167\u5c04\u6216\u52a0\u71b1\u4e0b\uff0c\u53cd\u61c9\u767c\u751f\u5728\u5074\u93c8\u7532\u57fa\u4e0a\uff0c\u5c6c\u65bc\u81ea\u7531\u57fa\u53d6\u4ee3\u53cd\u61c9\uff0c\u751f\u6210\u6c2f\u5316\u82c4\u3002");
}
function runTolueneOxidation() {
  finishReaction("\x43\x36\x48\x35\x43\x4f\x4f\x48", "\u82ef\u7532\u9178", null, "\u7532\u82ef\u8207\u5f37\u6c27\u5316\u5291\uff08\u5982\u9178\u6027\u904e\u9333\u9178\u9240\uff09\u5171\u71b1\uff0c\u5074\u93c8\u7532\u57fa\u6703\u88ab\u6c27\u5316\u6210\u7fa7\u57fa\uff0c\u6700\u7d42\u751f\u6210\u82ef\u7532\u9178\u3002");
}
