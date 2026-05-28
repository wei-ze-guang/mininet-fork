# Mininet 功能清单

本文基于当前仓库源码、`README.md`、`examples/README.md` 以及 `mininet/`、`bin/mn`、`examples/cluster.py` 等核心文件整理，目标是把这个 `mininet` 分支实际提供的功能尽量完整地列出来。

## 1. 项目定位

Mininet 是一个在单机 Linux 上模拟完整网络的框架，核心目标是快速原型化和测试 SDN / OpenFlow 网络。它通过以下机制工作：

- 使用进程隔离和 network namespace 模拟主机
- 使用软件交换机模拟交换节点
- 使用 veth pair 模拟链路
- 通过 Python API、命令行和 CLI 交互方式管理整个网络

## 2. 核心网络模拟能力

### 2.1 网络对象与生命周期管理

`mininet/net.py` 中的 `Mininet` 主类提供：

- 创建网络对象
- 根据拓扑批量创建 host、switch、controller、link
- 手工动态添加 host、switch、controller、NAT、link
- 删除节点和链路
- 启动网络
- 停止网络
- 一键执行 `start -> test -> stop`
- 等待交换机连接控制器
- 遍历/按名称获取网络中的节点

具体能力包括：

- `addHost()`：添加主机
- `addSwitch()`：添加交换机
- `addController()`：添加控制器
- `addNAT()`：添加 NAT 出口节点
- `addLink()`：连接两个节点
- `delHost()` / `delSwitch()` / `delController()` / `delLink()`：删除对象
- `linksBetween()` / `delLinkBetween()`：查找和删除节点之间的链路
- `buildFromTopo()`：从拓扑对象自动构建网络
- `build()` / `start()` / `stop()`：构建、启动、停止网络
- `interact()`：启动网络后进入 CLI

### 2.2 地址和资源自动分配

`Mininet` 内置一些自动化配置能力：

- 基于 `ipBase` 自动给 host 分配 IP 地址
- 可自动给 host 分配 MAC 地址
- 可自动为 host 绑定 CPU core
- 可自动下发静态 ARP 表
- 可自动为交换机分配监听端口

### 2.3 链路状态与运行时控制

运行中的网络支持：

- 动态修改链路上下线状态
- 查询链路列表
- 查询节点连接关系
- 查询交换机端口
- 动态停止/启动交换机
- 动态启动图形终端连接节点

## 3. 节点模型能力

`mininet/node.py` 定义了较完整的节点体系。

### 3.1 通用节点能力

`Node` 提供：

- 在 namespace 中启动 shell
- 在节点内部执行命令
- 异步发送命令并监控输出
- 读写节点标准输入输出
- 管理节点接口和端口映射
- 配置私有目录挂载
- 进程清理和终止

常见操作能力：

- `cmd()`：同步执行命令
- `sendCmd()` / `monitor()` / `waitOutput()`：异步命令与输出监控
- `pexec()` / `popen()`：运行外部进程
- `addIntf()` / `delIntf()`：管理接口
- `connectionsTo()`：查看到另一个节点的接口连接
- `setIP()` / `setMAC()` / `setARP()` / `setHostRoute()` / `setDefaultRoute()`：网络配置

### 3.2 Host 能力

`Host` 是最基础的虚拟主机模型，支持：

- 作为 namespace 中的 Linux 进程运行
- 执行任意 Linux 用户态程序
- 配置 IP / MAC / 路由
- 作为测试端运行 `ping`、`iperf`、`sshd`、自定义脚本等

### 3.3 CPU 受限主机

`CPULimitedHost` 支持：

- 基于 cgroups 的 CPU 限速
- 支持 `rt` 和 `cfs` 两类调度模式
- 结合性能测试验证 CPU 限流效果

### 3.4 交换机类型

源码内置多种交换/桥接实现：

- `UserSwitch`：OpenFlow 参考实现的用户态交换机
- `OVSSwitch`：Open vSwitch 交换机
- `OVSKernelSwitch`：默认 OVS 内核态风格交换机
- `OVSBridge`：基于 OVS 的二层 bridge，支持 STP
- `IVSSwitch`：Indigo Virtual Switch
- `LinuxBridge`：基于 Linux bridge 的交换机，可选 STP

这些交换机支持的能力包括：

- 与一个或多个控制器建立连接
- 通过 `dpctl` / `ovs-ofctl` 做状态查询和控制
- 批量启动和批量关闭
- 指定 datapath / dpid / failMode / OpenFlow 协议等参数

### 3.5 控制器类型

内置控制器模型包括：

- `Controller`：默认参考控制器
- `OVSController`
- `NOX`
- `Ryu`
- `RemoteController`
- `NullController`：无控制器模式

对应能力：

- 启动本地控制器进程
- 连接远程控制器
- 自动发现系统中可用控制器
- 支持多控制器网络

## 4. 接口与链路能力

`mininet/link.py` 提供接口和链路抽象。

### 4.1 接口能力

`Intf` 支持：

- 设置 IP
- 设置 MAC
- 接口启停
- 重命名接口
- 查询接口状态
- 删除接口
- 从系统读取最新 IP/MAC 状态

### 4.2 受控链路能力

`TCIntf` / `TCLink` / `TCULink` 支持用 Linux `tc` 模拟链路条件，包括：

- 带宽限制
- 时延
- 抖动
- 丢包率
- 最大队列长度
- RED
- ECN
- TBF / HFSC 等队列能力

### 4.3 链路类型

内置链路类型包括：

- `Link`：普通 veth 链路
- `TCLink`：支持 `tc` 参数的链路
- `TCULink`
- `OVSLink`

可支持的场景包括：

- 普通主机到交换机连接
- 交换机到交换机连接
- 多链路并行连接
- 运行时上下线控制

## 5. 拓扑构建能力

`mininet/topo.py` 和 `mininet/topolib.py` 提供可编程拓扑。

### 5.1 拓扑基类能力

`Topo` 支持：

- 添加 host
- 添加 switch
- 添加 link
- 给节点和链路附加参数
- 查询 hosts / switches / links
- 获取节点和链路信息
- 程序化生成拓扑

### 5.2 内置拓扑

当前仓库内置的主要拓扑包括：

- `MinimalTopo`
- `SingleSwitchTopo`
- `SingleSwitchReversedTopo`
- `LinearTopo`
- `TreeTopo`
- `TorusTopo`

这些拓扑覆盖了：

- 最小网络
- 单交换机多主机
- 线性链式网络
- 树形网络
- 环/网格风格的 torus 网络

### 5.3 可参数化拓扑

`mn` 命令支持通过参数直接构建拓扑，例如：

- `--topo tree,depth=2,fanout=3`
- `--topo linear,...`
- `--topo torus,...`

说明这个仓库支持：

- 命令行参数化拓扑
- Python 子类自定义拓扑
- 手工空网络后逐个加节点/链路

## 6. 命令行启动器能力

`bin/mn` 是统一入口，提供：

- 从命令行快速启动网络
- 选择拓扑、交换机、主机、控制器、链路类型
- 运行内置测试
- 加载自定义 Python 文件扩展能力
- 启动前/启动后执行 CLI 脚本
- 开启 xterm
- 清理系统残留

### 6.1 可选拓扑

`mn` 内置支持：

- `minimal`
- `linear`
- `reversed`
- `single`
- `tree`
- `torus`

### 6.2 可选交换机

`mn` 内置支持：

- `user`
- `ovs`
- `ovsbr`
- `ovsk`
- `ivs`
- `lxbr`
- `default`

### 6.3 可选主机

`mn` 内置支持：

- `proc`
- `rt`
- `cfs`

### 6.4 可选控制器

`mn` 内置支持：

- `ref`
- `ovsc`
- `nox`
- `remote`
- `ryu`
- `default`
- `none`

### 6.5 可选链路

`mn` 内置支持：

- `default`
- `tc`
- `tcu`
- `ovs`

### 6.6 主要启动参数能力

从 `bin/mn` 可直接看出的功能参数有：

- `--clean`：清理并退出
- `--custom`：加载自定义类/参数文件
- `--test`：运行内置测试
- `--xterms`：为节点启动终端
- `--ipbase`：指定地址池
- `--mac`：自动分配 MAC
- `--arp`：自动下发静态 ARP
- `--verbosity`：调日志级别
- `--innamespace`：交换机和控制器也放入 namespace
- `--listenport` / `--nolistenport`：控制监听端口策略
- `--pre` / `--post`：在测试前后运行 CLI 脚本
- `--pin`：主机绑核
- `--nat`：为网络增加 NAT 出口
- `--version`：输出版本
- `--wait` / `--twait`：等待交换机连接控制器
- `--cluster`：启用实验性的多机 cluster 模式
- `--placement`：cluster 模式下控制节点放置策略

## 7. CLI 交互能力

`mininet/cli.py` 提供运行中网络的交互控制台。

### 7.1 网络查看与诊断

CLI 内置命令包括：

- `nodes`：列出所有节点
- `ports`：查看交换机端口
- `net`：查看网络连接关系
- `intfs`：查看节点接口
- `dump`：打印节点对象信息
- `links`：查看链路状态

### 7.2 连通性与性能测试

- `pingall`
- `pingpair`
- `pingallfull`
- `pingpairfull`
- `iperf`
- `iperfudp`
- `time <command>`：统计命令耗时
- `wait`：等待交换机连接控制器

### 7.3 运行时控制

- `link node1 node2 up/down`：控制链路上下线
- `switch <name> start/stop`：启停交换机
- `dpctl ...`：对所有交换机下发管理命令

### 7.4 节点命令执行

CLI 支持直接让节点执行命令，例如：

- `h1 ifconfig`
- `h2 ping h3`

并支持：

- 自动把命令中的节点名替换成 IP
- `sh`：执行宿主机 shell 命令
- `py`：执行 Python 表达式
- `px`：执行 Python 语句
- `source <file>`：从脚本批量执行 CLI 命令
- `noecho`：运行交互命令时关闭回显

### 7.5 图形终端/X11 能力

- `xterm`
- `gterm`
- `x`

说明 Mininet 支持：

- 为节点单独开图形终端
- 建立 X11 隧道
- 在图形环境中交互调试节点

## 8. 网络测试与测量能力

`mininet/net.py` 中直接提供的测试/测量功能有：

- `ping()`：主机间连通性测试
- `pingAll()` / `pingPair()`：便捷连通性测试
- `pingFull()` / `pingAllFull()` / `pingPairFull()`：返回更完整的 RTT 结果
- `iperf()`：TCP/UDP 带宽测试
- `runCpuLimitTest()`：CPU 限速测试
- `monitor()`：监控多个 host 的输出流

因此这个仓库具备：

- 连通性验证
- RTT 统计
- TCP 吞吐测试
- UDP 吞吐测试
- CPU 限额行为验证
- 多节点输出监控

## 9. NAT 与外网连通能力

`mininet/nodelib.py` 中的 `NAT` 和 `examples/nat.py` / `natnet.py` 表明仓库支持：

- 把 Mininet 私网接到外部物理网络
- 自动配置 `iptables` NAT 规则
- 自动开启 IP forwarding
- 自动给 host 设置默认路由
- 通过 NAT 访问互联网或宿主机外部网络

## 10. 二层桥接与 STP 能力

`LinuxBridge` 和 `OVSBridge` 说明该仓库支持：

- 使用 Linux bridge / OVS bridge 作为二层交换设备
- 可选启用 STP
- 处理存在环路的拓扑场景

`TorusTopo` 的注释也明确提示：

- 存在环路的拓扑需要 STP 或支持该场景的控制器

## 11. 控制网络能力

`MininetWithControlNet` 和 `examples/controlnet.py` 表明仓库支持：

- 将数据网络和控制网络分离建模
- 为 user-space switch/控制器配置控制网络
- 路由型控制网络配置

这意味着可以模拟：

- OpenFlow 数据平面网络
- 控制器管理网络
- 控制网络与数据网络并存的场景

## 12. 多控制器能力

`examples/controllers.py` 和 `examples/controllers2.py` 表明仓库支持：

- 一个网络接多个控制器
- 通过自定义 switch 子类控制控制器分配
- 手工创建空网络后再手动挂接控制器和交换机

## 13. 空网络与低层 API 能力

`examples/emptynet.py`、`scratchnet.py`、`scratchnetuser.py` 表明仓库支持：

- 不依赖现成拓扑对象，手工创建空网络
- 以较低层 API 逐个创建 node、link
- 更贴近底层机制地构建网络

## 14. 真实接口接入能力

`examples/hwintf.py` 表明仓库支持：

- 把真实物理网卡或宿主机已有接口接入 Mininet 网络
- 在网络创建后再动态添加接口

这使它可以做：

- 半实物实验
- Mininet 与外部真实设备联调

## 15. 目录隔离与文件系统能力

`Node.privateDirs` 和 `examples/bind.py` 表明仓库支持：

- 为节点挂载私有目录
- bind mount 指定目录
- 用 tmpfs 为节点提供隔离目录

适用场景：

- 每个主机使用独立配置目录
- 为多节点进程模拟各自的文件环境

## 16. 可视化编辑能力

`examples/miniedit.py` 表明仓库支持：

- 图形化编辑网络拓扑
- 通过 GUI 方式创建网络

## 17. 节点迁移/移动能力

`examples/mobility.py` 表明仓库支持：

- 将 host 的接口从一个交换机拆下
- 再接到另一个交换机
- 以这种方式模拟主机移动

## 18. VLAN 能力

`examples/vlanhost.py` 表明仓库支持：

- 通过自定义 `Host` 子类使用 VLAN
- 在主接口上配置 VLAN 场景

## 19. 多链路能力

`examples/multilink.py` 表明仓库支持：

- 在两个节点之间建立多条链路
- 验证并行链路和端口映射场景

## 20. 路由器模拟能力

`examples/linuxrouter.py` 表明仓库支持：

- 用 Linux IP forwarding 模拟路由器
- 做三层转发和多网段路由实验

## 21. SSH 服务能力

`examples/sshd.py` 和 `baresshd.py` 表明仓库支持：

- 在 host namespace 中运行 `sshd`
- 通过 SSH 连接进入 Mininet 主机
- 构造带远程登录能力的实验环境

## 22. 多节点输出与异步进程监控能力

`examples/multiping.py`、`multipoll.py`、`popen.py`、`popenpoll.py` 表明仓库支持：

- 异步启动节点进程
- 同时监控多个节点输出
- 使用 `host.popen()` / `node.monitor()` / `pmonitor()` 进行并发观测

## 23. 性能与限速实验能力

`examples/cpu.py`、`simpleperf.py`、`linearbandwidth.py`、`limit.py`、`intfoptions.py` 表明仓库支持：

- CPU 限速实验
- 带宽限速实验
- delay/loss 等链路参数实验
- 运行时重新配置 `tc`
- 对不同网络规模或参数做批量性能测试

## 24. 端口编号与接口一致性验证

`examples/numberedports.py` 表明仓库支持：

- 检查 Mininet 端口号
- 检查 OVS 端口号
- 检查接口编号映射是否一致

## 25. 大规模拓扑实验能力

`examples/tree1024.py` 和 `treeping64.py` 表明仓库支持：

- 构建上百到上千主机的树形网络
- 在较大规模拓扑上运行连通性验证
- 验证不同交换机/数据路径类型在规模下的表现

## 26. Cluster Edition 实验能力

`examples/cluster.py`、`clustercli.py`、`clusterdemo.py`、`clusterSanity.py`、`clusterperf.py` 表明这个分支包含实验性的多机版 Mininet。

主要功能包括：

- 把节点分布到多台服务器运行
- `RemoteHost`
- `RemoteOVSSwitch`
- `RemoteLink`
- `RemoteSSHLink`
- `RemoteGRELink`
- 多种节点放置策略：
  - `RandomPlacer`
  - `RoundRobinPlacer`
  - `SwitchBinPlacer`
  - `HostSwitchBinPlacer`
- `MininetCluster`：多机网络总控对象
- `ClusterCLI`：cluster 专用 CLI
- 远程隧道与跨机链路实验
- 跨机拓扑部署与性能测试

这说明该仓库不仅能做单机模拟，也带有实验性的多机扩展能力。

## 27. 清理与环境恢复能力

`mininet/clean.py` 提供较完整的清理能力：

- 杀掉残留 controller / switch / test 进程
- 清理 `/tmp` 中遗留文件
- 清理 X11 相关残留
- 删除旧 OVS bridge / datapath
- 删除遗留的 `*-ethX` 接口
- 清理 cluster 隧道残留
- 清理残留 `mnexec` 和 Mininet node 进程
- 支持额外 cleanup callback

对应命令入口：

- `mn -c`

## 28. 日志与输出控制能力

`mininet/log.py` 支持：

- `debug`
- `info`
- `output`
- `warning`
- `error`
- `critical`

特点：

- CLI 输出有单独的 `OUTPUT` 日志级别
- 适合区分框架日志与实验输出

## 29. 文档与可扩展能力

从仓库结构看，还支持：

- Python `help()` / docstring 形式 API 文档
- `make doc` 生成文档
- `--custom` 动态扩展自定义拓扑/设备/测试
- `custom/` 目录存放自定义扩展示例

## 30. 按示例文件归纳的功能覆盖

为避免遗漏，下面按 `examples/` 再列一次功能映射：

- `baresshd.py`：在 namespace 中运行 `sshd`
- `bind.py`：节点私有目录 / 目录绑定
- `cluster.py`：实验性 cluster edition
- `clusterSanity.py`：cluster 基础验证
- `clustercli.py`：cluster 专用 CLI
- `clusterdemo.py`：多服务器 cluster 演示
- `clusterperf.py`：cluster 性能测试
- `consoles.py`：多控制台/图形监控
- `controllers.py`：多控制器网络
- `controllers2.py`：手工方式配置多控制器
- `controlnet.py`：控制网络 + 数据网络双网络建模
- `cpu.py`：CPU 限速测试
- `emptynet.py`：空网络 + 手工加节点
- `hwintf.py`：接入真实硬件接口
- `intfoptions.py`：运行时重配链路参数
- `limit.py`：CPU/链路限速
- `linearbandwidth.py`：自定义线性拓扑 + 带宽测试
- `linuxrouter.py`：Linux 路由器
- `miniedit.py`：GUI 拓扑编辑
- `mobility.py`：主机迁移/接口切换
- `multilink.py`：多链路
- `multiping.py`：多节点输出监控
- `multipoll.py`：多节点输出文件轮询
- `multitest.py`：批量运行测试
- `nat.py`：通过 NAT 连外网
- `natnet.py`：NAT 节点组网
- `numberedports.py`：端口号一致性验证
- `popen.py`：并发子进程监控
- `popenpoll.py`：基于 `popen()` 的多输出监控
- `scratchnet.py`：最低层网络创建方式
- `scratchnetuser.py`：低层 API 的另一种用法
- `simpleperf.py`：简单性能实验
- `sshd.py`：在各 host 上运行 SSH 服务
- `tree1024.py`：大规模树形网络
- `treeping64.py`：64 主机树形网络连通性验证
- `vlanhost.py`：VLAN Host

## 31. 总结

如果把这个仓库的功能浓缩成一句话，它提供的是一套“可编程、可交互、可测试、可扩展”的网络仿真平台，核心能力可以概括为：

- 单机 Linux 上模拟 host/switch/controller/link
- 支持多种交换机、控制器、链路和拓扑
- 支持 CLI、Python API、命令行三种主要使用方式
- 支持连通性、带宽、CPU、链路参数等实验
- 支持 NAT、真实网卡接入、控制网络、VLAN、路由器等进阶场景
- 支持实验性的多机 cluster 模式

如果你愿意，我下一步可以继续帮你再出一份“按源码目录拆解的阅读路线”，比如先看哪个文件、每个文件负责什么。这样你后面读这套源码会更快。
