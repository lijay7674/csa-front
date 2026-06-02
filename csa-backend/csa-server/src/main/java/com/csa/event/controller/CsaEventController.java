package com.csa.event.controller;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.common.R;
import com.csa.event.entity.CsaEvent;
import com.csa.event.service.CsaEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
@Tag(name = "活动管理", description = "后台活动管理接口")
public class CsaEventController {

    private final CsaEventService eventService;

    @GetMapping
    @Operation(summary = "分页查询活动列表")
    public R<IPage<CsaEvent>> list(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "活动类型") @RequestParam(required = false) String eventType,
            @Parameter(description = "活动状态") @RequestParam(required = false) String status,
            @Parameter(description = "关键词（标题/描述）") @RequestParam(required = false) String keyword) {
        IPage<CsaEvent> result = eventService.listPage(page, size, eventType, status, keyword);
        return R.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取活动详情")
    public R<CsaEvent> get(@Parameter(description = "活动ID") @PathVariable Long id) {
        CsaEvent event = eventService.getById(id);
        if (event == null) {
            return R.fail("活动不存在");
        }
        return R.ok(event);
    }

    @PostMapping
    @Operation(summary = "创建活动")
    public R<CsaEvent> create(@RequestBody CsaEvent event) {
        CsaEvent saved = eventService.save(event);
        log.info("Event created: id={}, title={}", saved.getId(), saved.getTitle());
        return R.ok(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新活动")
    public R<CsaEvent> update(@Parameter(description = "活动ID") @PathVariable Long id,
                              @RequestBody CsaEvent event) {
        CsaEvent existing = eventService.getById(id);
        if (existing == null) {
            return R.fail("活动不存在");
        }
        CsaEvent updated = eventService.update(id, event);
        log.info("Event updated: id={}", id);
        return R.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除活动")
    public R<Void> delete(@Parameter(description = "活动ID") @PathVariable Long id) {
        CsaEvent existing = eventService.getById(id);
        if (existing == null) {
            return R.fail("活动不存在");
        }
        eventService.delete(id);
        log.info("Event deleted: id={}", id);
        return R.ok();
    }
}
