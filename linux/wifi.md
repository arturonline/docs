# Connect to a wifi network in linux

## #1: Using nmtui (graphical interface)

```sh
$ nmtui
```

## #2: Using nmcli (terminal)

1. Get the wifi interface name:

```sh
$ iw dev 
```

2. Scan for nearby wireless network

```sh
$ sudo iwlist <interface_name> scan | grep -i ESSID
```

3. And finally, connect to the network: 

```sh
$ nmcli dev wifi connect <essid_name> password <password>
```

We can verify with: 

```sh
$ iw <interface_name> link
```


