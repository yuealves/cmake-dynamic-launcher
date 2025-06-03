# CMake Dynamic Launcher

This VS Code extension provides a convenient way to dynamically set and run CMake targets based on the currently active C/C++ file. It automatically determines the target name from the file path and runs it without any manual intervention.

## Features

- Automatically determines CMake target names from file paths
- Builds and runs targets with a single keyboard shortcut
- Cross-platform support (Windows, macOS, Linux)
- Supports multiple build directories
- No UI interruption during target switching

## Prerequisites

- Visual Studio Code 1.100.0 or higher
- CMake Tools extension
- CMake installed and configured in your project

## Installation

1. Install the extension through VS Code Marketplace
2. Make sure you have CMake Tools extension installed
3. Open your CMake project in VS Code

## Usage

1. Open a C/C++ source file in your CMake project
2. Press the keyboard shortcut to build and run the corresponding target:
   - macOS: `Cmd+R`
   - Windows/Linux: `Alt+R`

The extension will:

1. Extract the target name from your file path (e.g., `my_project/src/module/submodule.cc` → `module_submodule`)
2. Build the target using CMake
3. Find and run the executable

### Example

If your project structure looks like this:

```text
my_project/
  ├── CMakeLists.txt
  └── src/
      ├── math/
      │   ├── add.cc
      │   └── CMakeLists.txt
      └── utils/
          ├── helper.cc
          └── CMakeLists.txt
```

When you're editing `src/math/add.cc` and press the shortcut key:

1. The extension will determine the target name as `math_add`
2. Build the target using CMake
3. Run the resulting executable

## Configuration

The extension automatically searches for executables in common CMake build directories:

- `build/`
- `out/build/`
- `cmake-build-debug/`
- `cmake-build-release/`

## Requirements

Your CMake targets should follow the naming convention: `{directory_name}_{file_name}`. For example, if you're editing a file at `path/to/module/file.cc`, your CMakeLists.txt should define a target named `module_file`.

## Known Issues

- The target naming convention is currently fixed. Custom naming patterns are not yet supported.
- The extension assumes the target name is derived from the immediate parent directory and file name.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is released under the [MIT License](LICENSE).