# Cocoapods

How to add *Alamofire* and *SwiftyJSON*

## Steps

1. Inside Terminal, Change Directory to the folder containing the project
2. Initialise a new Podfile `pod init`
3. Edit the new created `Podfile` in Xcode, ex:
    ```bash
    # Uncomment the next line to define a global platform for your project
    platform :ios, '9.0'

    target 'BitcoinTicker' do
        # Comment the next line if you're not using Swift and don't want to use dy    namic frameworks
        use_frameworks!

        # Pods for BitcoinTicker
        pod 'Alamofire'
        pod 'SwiftyJSON'
    end
    ```
4. Make sure you uncomment the use_frameworks and target platform :ios, '9.0'
5. Run pod install in Terminal
6. Open the .xcworkspace file
7. Product > Build