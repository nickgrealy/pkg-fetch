"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileOnUnix = compileOnUnix;
exports.default = build;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = require("fs-extra");

var _spawn = require("./spawn.js");

var _copyFile = require("./copy-file.js");

var _system = require("./system.js");

var _log = require("./log.js");

var _patches = _interopRequireDefault(require("../patches/patches.json"));

var _path = _interopRequireDefault(require("path"));

var _tempPath = require("./temp-path.js");

var _thresholds = _interopRequireDefault(require("./thresholds.js"));

var buildPath;

if (process.env.GITHUB_USERNAME) {
  buildPath = _path.default.join(__dirname, '..', 'precompile');
} else {
  buildPath = (0, _tempPath.tempPath)();
}

var nodePath = _path.default.join(buildPath, 'node');

var patchesPath = _path.default.resolve(__dirname, '../patches');

var nodeRepo = 'https://github.com/nodejs/node';

function gitClone() {
  return _gitClone.apply(this, arguments);
}

function _gitClone() {
  _gitClone = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var args, promise;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _log.log.info('Cloning Node.js repository from GitHub...');

            args = ['clone', '--bare', '--progress', nodeRepo, 'node/.git'];
            promise = (0, _spawn.spawn)('git', args, {
              cwd: buildPath
            });
            (0, _spawn.progress)(promise, (0, _thresholds.default)('clone'));
            _context.next = 6;
            return promise;

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _gitClone.apply(this, arguments);
}

function gitResetHard(_x) {
  return _gitResetHard.apply(this, arguments);
}

function _gitResetHard() {
  _gitResetHard = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(nodeVersion) {
    var patches, commit, args;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _log.log.info(`Checking out ${nodeVersion}`);

            patches = _patches.default[nodeVersion];
            commit = patches.commit || nodeVersion;
            args = ['--work-tree', '.', 'reset', '--hard', commit];
            _context2.next = 6;
            return (0, _spawn.spawn)('git', args, {
              cwd: nodePath
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _gitResetHard.apply(this, arguments);
}

function applyPatches(_x2) {
  return _applyPatches.apply(this, arguments);
}

function _applyPatches() {
  _applyPatches = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(nodeVersion) {
    var patches, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patch, patchPath, args;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _log.log.info('Applying patches');

            patches = _patches.default[nodeVersion];
            patches = patches.patches || patches;
            if (patches.sameAs) patches = _patches.default[patches.sameAs];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 7;
            _iterator = patches[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 18;
              break;
            }

            patch = _step.value;
            patchPath = _path.default.join(patchesPath, patch);
            args = ['-p1', '-i', patchPath];
            _context3.next = 15;
            return (0, _spawn.spawn)('patch', args, {
              cwd: nodePath
            });

          case 15:
            _iteratorNormalCompletion = true;
            _context3.next = 9;
            break;

          case 18:
            _context3.next = 24;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context3.t0;

          case 24:
            _context3.prev = 24;
            _context3.prev = 25;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 27:
            _context3.prev = 27;

            if (!_didIteratorError) {
              _context3.next = 30;
              break;
            }

            throw _iteratorError;

          case 30:
            return _context3.finish(27);

          case 31:
            return _context3.finish(24);

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[7, 20, 24, 32], [25,, 27, 31]]);
  }));
  return _applyPatches.apply(this, arguments);
}

function compileOnWindows(_x3, _x4) {
  return _compileOnWindows.apply(this, arguments);
}

function _compileOnWindows() {
  _compileOnWindows = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(nodeVersion, targetArch) {
    var args, major, promise;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            args = [];
            args.push('/c', 'vcbuild.bat', targetArch, 'noetw');
            major = nodeVersion.match(/^v?(\d+)/)[1] | 0;
            if (major <= 10) args.push('nosign', 'noperfctr');
            promise = (0, _spawn.spawn)('cmd', args, {
              cwd: nodePath
            });
            (0, _spawn.progress)(promise, (0, _thresholds.default)('vcbuild', nodeVersion));
            _context4.next = 8;
            return promise;

          case 8:
            if (!(major <= 10)) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", _path.default.join(nodePath, 'Release/node.exe'));

          case 10:
            return _context4.abrupt("return", _path.default.join(nodePath, 'out/Release/node.exe'));

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _compileOnWindows.apply(this, arguments);
}

function compileOnUnix(_x5, _x6) {
  return _compileOnUnix.apply(this, arguments);
}

function _compileOnUnix() {
  _compileOnUnix = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(nodeVersion, targetArch) {
    var opts,
        fullyStatic,
        args,
        cpu,
        major,
        make,
        promise,
        output,
        _args5 = arguments;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            opts = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            fullyStatic = opts.fullyStatic;
            args = [];
            cpu = {
              x86: 'ia32',
              x64: 'x64',
              armv6: 'arm',
              armv7: 'arm',
              arm64: 'arm64',
              s390x: 's390x'
            }[targetArch];
            args.push('--dest-cpu', cpu); // first of all v8_inspector introduces the use
            // of `prime_rehash_policy` symbol that requires
            // GLIBCXX_3.4.18 on some systems
            // also we don't support any kind of debugging
            // against packaged apps, hence v8_inspector is useless

            major = nodeVersion.match(/^v?(\d+)/)[1] | 0;
            if (fullyStatic === true) args.push('--fully-static');
            if (major >= 6) args.push('--without-inspector'); // https://github.com/mhart/alpine-node/blob/base-7.4.0/Dockerfile#L33

            if (_system.hostPlatform === 'alpine') args.push('--without-snapshot'); // TODO same for windows?

            _context5.next = 11;
            return (0, _spawn.spawn)('./configure', args, {
              cwd: nodePath
            });

          case 11:
            make = _system.hostPlatform === 'freebsd' ? 'gmake' : 'make';
            promise = (0, _spawn.spawn)(make, [], {
              cwd: nodePath
            });
            (0, _spawn.progress)(promise, (0, _thresholds.default)('make', nodeVersion));
            _context5.next = 16;
            return promise;

          case 16:
            output = _path.default.join(nodePath, 'out/Release/node'); // https://github.com/mhart/alpine-node/blob/base-7.4.0/Dockerfile#L36

            if (!(_system.hostPlatform === 'alpine')) {
              _context5.next = 20;
              break;
            }

            _context5.next = 20;
            return (0, _spawn.spawn)('paxctl', ['-cm', output]);

          case 20:
            return _context5.abrupt("return", output);

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _compileOnUnix.apply(this, arguments);
}

function compile(_x7, _x8, _x9) {
  return _compile.apply(this, arguments);
}

function _compile() {
  _compile = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6(nodeVersion, targetArch, opts) {
    var win;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _log.log.info('Compiling Node.js from sources...');

            win = _system.hostPlatform === 'win';

            if (!win) {
              _context6.next = 6;
              break;
            }

            _context6.next = 5;
            return compileOnWindows(nodeVersion, targetArch);

          case 5:
            return _context6.abrupt("return", _context6.sent);

          case 6:
            _context6.next = 8;
            return compileOnUnix(nodeVersion, targetArch, opts);

          case 8:
            return _context6.abrupt("return", _context6.sent);

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _compile.apply(this, arguments);
}

function build(_x10, _x11, _x12, _x13) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee7(nodeVersion, targetArch, local, opts) {
    var output;
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _fsExtra.remove)(buildPath);

          case 2:
            _context7.next = 4;
            return (0, _fsExtra.mkdirp)(buildPath);

          case 4:
            _context7.next = 6;
            return gitClone();

          case 6:
            _context7.next = 8;
            return gitResetHard(nodeVersion);

          case 8:
            _context7.next = 10;
            return applyPatches(nodeVersion);

          case 10:
            _context7.next = 12;
            return compile(nodeVersion, targetArch, opts);

          case 12:
            output = _context7.sent;
            _context7.next = 15;
            return (0, _fsExtra.mkdirp)(_path.default.dirname(local));

          case 15:
            _context7.next = 17;
            return (0, _copyFile.copyFile)(output, local);

          case 17:
            _context7.next = 19;
            return (0, _fsExtra.remove)(buildPath);

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _build.apply(this, arguments);
}