# Mininet Replay Collector Design

## 1. Goal

为 Mininet 补一层可结构化采集、可回放、可供前端渲染的数据采集系统。

第一版目标不是做完整 UI，而是稳定产出一套足够正确的运行数据，让后续前端能够实现：

- 拓扑展示
- 节点/接口/链路补充标签展示
- 路由表、ARP/邻居表、OVS flow table 等表状态查看
- 数据流逐步回放
- ARP、ICMP、TCP、UDP 这类常见协议的时序还原

## 2. Scope

### 2.1 第一版支持对象

- Host
- Linux Router / NAT
- OVS Switch

### 2.2 第一版支持协议

- ARP
- ICMP
- TCP
- UDP

### 2.3 第一版明确不做

- BGP / OSPF / MPLS 等高级控制平面协议深度解析
- 默认保存全量 pcap
- 内核内部 datapath 精细级 trace
- 前端页面实现

## 3. Core Approach

采用“双轨采集”方案：

1. 状态快照
- 周期采集节点和交换机的关键表状态
- 用于回放时展示“当时系统是怎么做决策的”

2. 报文摘要事件
- 在关键接口上抓取报文摘要
- 用于还原“包从哪里来、经过哪里、准备去哪里”

这两个数据源结合后，能够在不过分扩大数据量的前提下，提供较可靠的回放结果。

## 4. Data Volume Strategy

为了保证服务器可承受、数据可回放、后续可扩展，数据分为 3 层：

### 4.1 L0 静态拓扑数据

每次运行只记录一次：

- 节点
- 接口
- 链路
- 节点类型
- 初始 IP / MAC

特点：

- 体量小
- 用于构建整个运行的基础图谱

### 4.2 L1 状态快照

按固定周期采样，第一版默认：

- `1000ms` 一次

采样内容：

- Host / Router / NAT
  - `ip route`
  - `ip neigh`
  - `ip -s link`
  - 可选 `iptables -t nat -L -n -v`
- OVS
  - `ovs-ofctl dump-flows`
  - `ovs-ofctl dump-ports`
  - `ovs-ofctl show`

特点：

- 量可控
- 适合回放时查看“状态上下文”

### 4.3 L2 报文摘要事件

不默认存全量原始 pcap，而是存解析后的摘要事件。

第一版默认：

- 只抓关键接口
- 只保留 ARP / ICMP / TCP / UDP 摘要字段

特点：

- 数据量比全量 pcap 小很多
- 能支撑路径回放

## 5. Data Sources

### 5.1 来自 Mininet 对象模型

用于静态拓扑：

- 节点名
- 节点类型
- 接口名
- 链路关系
- IP / MAC 初始配置

### 5.2 来自 Linux 节点命令

用于 Host / Router / NAT：

- `ip route`
- `ip route get <dst>`
- `ip neigh`
- `ip -s link`
- `ss`
- `iptables -t nat -L -n -v`

### 5.3 来自 OVS 命令

用于 OVS：

- `ovs-vsctl show`
- `ovs-ofctl dump-flows`
- `ovs-ofctl dump-ports`
- `ovs-ofctl show`

### 5.4 来自抓包工具

用于报文摘要事件：

- `tcpdump -tt -n -e`

第一版优先使用 `tcpdump`，原因：

- 依赖更轻
- 服务器环境更容易满足
- 输出可解析

## 6. Output Layout

每次运行创建一个独立目录：

```text
runs/<run_id>/
```

目录内容：

```text
runs/<run_id>/
  meta.json
  topology.json
  annotations.json
  snapshots.ndjson
  events.ndjson
  traces.ndjson
```

说明：

- `meta.json`
  - 本次运行元信息
- `topology.json`
  - 静态拓扑
- `annotations.json`
  - 补充标签和展示语义
- `snapshots.ndjson`
  - 周期状态快照
- `events.ndjson`
  - 报文摘要事件
- `traces.ndjson`
  - 回放重建后的路径步骤

## 7. Identity Rules

Mininet 原生提供的是 `name`，如：

- `h11`
- `s1`
- `r1`

但仅用 `name` 不足以支持多次运行和回放，因此第一版定义稳定的运行内唯一 ID。

### 7.1 Run ID

每次实验生成一个 `run_id`，例如：

```text
run_20260527_001
```

### 7.2 Node ID

规则：

```text
node_id = <run_id>:<mn_name>
```

例如：

```text
run_20260527_001:h11
run_20260527_001:r1
run_20260527_001:s1
```

### 7.3 Interface ID

规则：

```text
intf_id = <run_id>:<node_name>:<intf_name>
```

例如：

```text
run_20260527_001:h11:h11-eth0
run_20260527_001:r1:r1-eth1
```

### 7.4 Link ID

规则：

```text
link_id = <run_id>:link:<intf_a>__<intf_b>
```

### 7.5 Flow ID

第一版 flow_id 不追求跨协议完美唯一，但要求在单次运行中足够区分。

建议规则：

```text
<proto>:<src_ip>[:src_port]-><dst_ip>[:dst_port]
```

ARP 可使用：

```text
arp:<sender_ip>-><target_ip>
```

## 8. Data Structures

### 8.1 `meta.json`

```json
{
  "run_id": "run_20260527_001",
  "started_at": "2026-05-27T12:00:00Z",
  "sampler_interval_ms": 1000,
  "packet_protocols": ["ARP", "ICMP", "TCP", "UDP"],
  "packet_capture_mode": "summary",
  "version": 1
}
```

### 8.2 `topology.json`

```json
{
  "nodes": [
    {
      "node_id": "run_20260527_001:h11",
      "mn_name": "h11",
      "kind": "host",
      "ip_addrs": ["10.0.1.11/24"],
      "mac_addrs": ["02:00:00:00:01:0b"]
    }
  ],
  "interfaces": [
    {
      "intf_id": "run_20260527_001:h11:h11-eth0",
      "node_id": "run_20260527_001:h11",
      "mn_name": "h11-eth0",
      "mac": "02:00:00:00:01:0b",
      "ip_addrs": ["10.0.1.11/24"]
    }
  ],
  "links": [
    {
      "link_id": "run_20260527_001:link:h11-eth0__s1-eth1",
      "a_intf_id": "run_20260527_001:h11:h11-eth0",
      "b_intf_id": "run_20260527_001:s1:s1-eth1"
    }
  ]
}
```

### 8.3 `annotations.json`

这是补充信息 map，用于节点、接口、链路、流量的展示和业务注解。

```json
{
  "nodes": {
    "run_20260527_001:r1": {
      "display_name": "主路由器",
      "role": "gateway",
      "tags": ["core", "gateway"],
      "labels": {
        "zone": "core"
      },
      "style": {
        "color": "#d94841",
        "icon": "router"
      },
      "notes": "负责三个局域网互通"
    }
  },
  "interfaces": {},
  "links": {},
  "flows": {}
}
```

设计原则：

- 只补充，不覆盖原始事实
- 可缺省
- 支持多标签
- 同时支持业务语义和展示语义

### 8.4 `snapshots.ndjson`

每一行是一条快照记录。

示例：

```json
{"ts":1710000000.100,"run_id":"run_20260527_001","node_id":"run_20260527_001:r1","mn_name":"r1","kind":"router","table":"routes","data":[{"dst":"10.0.2.0/24","dev":"r1-eth1","src":"10.0.2.1"}]}
{"ts":1710000000.120,"run_id":"run_20260527_001","node_id":"run_20260527_001:h11","mn_name":"h11","kind":"host","table":"neighbors","data":[{"ip":"10.0.1.1","mac":"aa:bb:cc:dd:ee:ff","dev":"h11-eth0","state":"REACHABLE"}]}
{"ts":1710000000.140,"run_id":"run_20260527_001","node_id":"run_20260527_001:s1","mn_name":"s1","kind":"ovs","table":"flows","data":[{"table":0,"priority":0,"match":"ip,nw_dst=10.0.2.11","actions":"output:2"}]}
```

第一版支持的 `table` 取值：

- `routes`
- `neighbors`
- `link_stats`
- `nat_rules`
- `flows`
- `port_stats`

### 8.5 `events.ndjson`

每一行是一条报文摘要事件。

```json
{"ts":1710000000.200,"run_id":"run_20260527_001","flow_id":"icmp:10.0.1.11->10.0.2.11","node_id":"run_20260527_001:h11","mn_name":"h11","intf_id":"run_20260527_001:h11:h11-eth0","intf_name":"h11-eth0","proto":"ICMP","src_mac":"02:00:00:00:01:0b","dst_mac":"aa:bb:cc:dd:ee:ff","src_ip":"10.0.1.11","dst_ip":"10.0.2.11","ttl":64,"length":98}
{"ts":1710000000.210,"run_id":"run_20260527_001","flow_id":"arp:10.0.1.11->10.0.1.1","node_id":"run_20260527_001:h11","mn_name":"h11","intf_id":"run_20260527_001:h11:h11-eth0","intf_name":"h11-eth0","proto":"ARP","arp_op":"request","arp_sender_ip":"10.0.1.11","arp_target_ip":"10.0.1.1"}
```

第一版建议字段：

- 通用字段
  - `ts`
  - `run_id`
  - `flow_id`
  - `node_id`
  - `mn_name`
  - `intf_id`
  - `intf_name`
  - `proto`
- 二层字段
  - `src_mac`
  - `dst_mac`
- 三层字段
  - `src_ip`
  - `dst_ip`
  - `ttl`
- 传输层字段
  - `src_port`
  - `dst_port`
- ARP 字段
  - `arp_op`
  - `arp_sender_ip`
  - `arp_target_ip`

### 8.6 `traces.ndjson`

每一行是一条重建后的回放步骤。

```json
{"ts":1710000000.220,"run_id":"run_20260527_001","flow_id":"icmp:10.0.1.11->10.0.2.11","step_index":3,"current_node":"run_20260527_001:r1","current_intf":"run_20260527_001:r1:r1-eth0","next_hop":"10.0.2.11","path":["run_20260527_001:h11","run_20260527_001:s1","run_20260527_001:r1","run_20260527_001:s2","run_20260527_001:h21"],"final_destination":"run_20260527_001:h21","event_ref":{"ts":1710000000.220,"node_id":"run_20260527_001:r1"},"evidence_sources":["packet_event","route_table","neighbor_table"],"confidence":"high"}
```

## 9. Replay Model

前端回放需要一个明确的时间推进模型。

第一版将回放拆成 4 个概念：

### 9.1 PacketEvent

原始事件事实。

说明：

- 代表“某时某接口看到一个协议事件”
- 不带强推断

### 9.2 TraceStep

从事件和状态中重建出的“路径一步”。

说明：

- 用来支撑“点击下一步”
- 直接面向前端

### 9.3 TraceContext

该步对应的状态上下文。

内容来自：

- 路由表
- ARP / 邻居表
- OVS flow table
- 端口统计

### 9.4 ReplayFrame

前端某一帧真正需要渲染的对象。

一个 `ReplayFrame` 至少应包含：

- 当前时间戳
- 当前流
- 当前步骤
- 当前节点
- 当前接口
- 下一跳
- 经过路径
- 最终目标
- 相关上下文引用

## 10. Replay Detail Target

“完整回放”的定义如下：

- 能展示协议事件顺序
- 能展示数据从哪个节点/接口发出
- 能展示到达了哪个交换机/路由器
- 能展示下一跳是谁
- 能展示最终目标是谁
- 能展示该步相关表状态

第一版特别要求覆盖：

- ARP 请求 / 响应
- ICMP echo / reply
- TCP 三次握手的关键事件
- UDP 普通单向报文

## 11. Correctness Strategy

为了保证“数据流尽量正确”，不能只靠单一来源。

采用“证据链”原则：

- 路由决策
  - `ip route get <dst>`
  - `ip route`
- 二层下一跳
  - `ip neigh`
- OVS 转发
  - `ovs-ofctl dump-flows`
  - `ovs-ofctl show`
- 实际经过
  - 多接口抓包摘要事件

每一条 `TraceStep` 都要带：

- `evidence_sources`
- `confidence`

`confidence` 第一版可取值：

- `high`
- `medium`
- `low`

## 12. Runtime Strategy

### 12.1 拓扑初始化阶段

创建运行目录并写入：

- `meta.json`
- `topology.json`
- 初始 `annotations.json`

### 12.2 状态采样阶段

启动后台采样器，固定周期抓：

- 路由表
- 邻居表
- 接口统计
- OVS flow / 端口信息

### 12.3 报文事件采集阶段

在关键接口上启动抓包命令，持续输出摘要，写入：

- `events.ndjson`

### 12.4 回放重建阶段

运行结束后，或准实时地把：

- `topology`
- `snapshots`
- `events`

合成为：

- `traces.ndjson`

## 13. Integration Plan

第一版实现从现有 `wzg-docs/run_multilan_demo.py` 开始集成。

实现思路：

1. 先把运行目录和拓扑导出做出来
2. 再加状态快照采样器
3. 再加报文摘要采集器
4. 最后做 trace 重建

## 14. Files To Add

建议新增一个轻量采集模块目录，例如：

```text
mininet_replay/
  __init__.py
  ids.py
  models.py
  topology_exporter.py
  samplers.py
  packet_capture.py
  trace_builder.py
  run_store.py
```

同时改造：

- `wzg-docs/run_multilan_demo.py`

使其可选开启 replay collector。

## 15. Risks

### 15.1 数据量风险

如果接口过多、抓包范围过大、采样频率过高，数据量会迅速膨胀。

缓解方式：

- 默认只抓关键接口
- 默认只存摘要
- 默认 `1000ms` 快照

### 15.2 路径重建误判

如果单靠抓包或单靠状态表，都可能误判路径。

缓解方式：

- 使用证据链
- 推断结果和原始事实分离存储
- 给每一步标明 `confidence`

### 15.3 命令输出解析漂移

不同系统版本命令输出可能略有差异。

缓解方式：

- 第一版固定以当前 Ubuntu 20.04 + OVS 环境为准
- 解析器写成小模块，便于后续适配

## 16. Success Criteria

第一版完成后，以下能力必须具备：

- 能生成 `runs/<run_id>/` 目录
- 能导出拓扑静态数据
- 能周期采集至少：
  - 路由表
  - 邻居表
  - OVS flow table
- 能记录 ARP / ICMP / TCP / UDP 报文摘要事件
- 能重建至少一条跨局域网流量的逐步路径
- 能生成前端可消费的回放步骤数据

## 17. Recommended Next Step

下一步进入实现计划与代码阶段，优先顺序如下：

1. 输出目录与 ID 规则落地
2. `topology.json` 导出
3. `snapshots.ndjson` 采样
4. `events.ndjson` 报文摘要采集
5. `traces.ndjson` 回放重建
