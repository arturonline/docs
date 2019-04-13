# Overview

For a long time, Microsoft has had a technology called Windows Management Instrumentation (**WMI**) built into the Windows operating system. WMI allow us to easily view, and sometimes modify, system information and configuration settings.

WMI is built on the **WBEM** and **CIM** standards from the Distributed Management Task Force (**DMTF**). As described by the **DMTF**, **“CIM** provides a common definition of management information for systems, networks, applications and services, and allows for vendor extensions. **CIM's** common definitions enable vendors to exchange semantically rich management information between systems throughout the network.”

## Basic terminology

If you are already familiar with terms like WMI, CIM, WinRM and WS-Man, you can skip this section.

**CIM**: Common Information Model (CIM) is the DMTF standard [DSP0004] for describing the structure and behavior of managed resources such as storage, network, or software components.

**WMI**: Windows Management Instrumentation (WMI) is a CIM server that implements the CIM standard on Windows.

**WS-Man**: WS-Management (WS-Man) protocol is a SOAP-based, firewall-friendly protocol for management clients to communicate with CIM servers.

**WinRM**: Windows Remote Management (WinRM) is the Microsoft implementation of the WS-Man protocol on Windows.

## CIM cmdlets

CIM allows software developers and hardware manufacturers to expose information, and it allows IT professionals to interact with hardware, using standards-based mechanisms.

You can easily find Windows PowerShell cmdlets related to CIM by using the Get-Command cmdlet.

```powershell
PS C:\> Get-Command -Noun CIM*
```

>💡 [Introduction to CIM Cmdlets](https://devblogs.microsoft.com/powershell/introduction-to-cim-cmdlets/)<br>💡 [Tips & Tricsk](https://devblogs.microsoft.com/powershell/cim-cmdlets-some-tips-tricks/)