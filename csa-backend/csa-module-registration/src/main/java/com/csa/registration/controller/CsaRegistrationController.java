package com.csa.registration.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.common.R;
import com.csa.registration.entity.CsaRegistration;
import com.csa.registration.service.CsaRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "报名管理")
@RestController
@RequestMapping("/api/admin/registrations")
@RequiredArgsConstructor
public class CsaRegistrationController {

    private final CsaRegistrationService csaRegistrationService;

    @Operation(summary = "分页查询报名列表")
    @GetMapping
    public R<IPage<CsaRegistration>> list(@RequestParam(defaultValue = "1") int page,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(required = false) String targetType,
                                           @RequestParam(required = false) Long targetId,
                                           @RequestParam(required = false) String status,
                                           @RequestParam(required = false) String keyword,
                                           @RequestParam(required = false) String regType) {
        IPage<CsaRegistration> result = csaRegistrationService.listPage(page, size, targetType, targetId, status, keyword, regType);
        return R.ok(result);
    }

    @Operation(summary = "根据ID获取报名详情")
    @GetMapping("/{id}")
    public R<CsaRegistration> getById(@PathVariable Long id) {
        CsaRegistration registration = csaRegistrationService.getById(id);
        if (registration == null) {
            return R.fail("报名记录不存�?);
        }
        return R.ok(registration);
    }

    @Operation(summary = "更新报名状态（审核�?)
    @PutMapping("/{id}/status")
    public R<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String comment = body.getOrDefault("comment", "");
        csaRegistrationService.updateStatus(id, status, comment, null);
        return R.ok();
    }

    @Operation(summary = "添加联系记录")
    @PutMapping("/{id}/contact-record")
    public R<Void> addContactRecord(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String method = body.get("method");
        String note = body.get("note");
        String record = "{\"method\":\"" + method + "\",\"note\":\"" + note + "\",\"time\":\"" + java.time.LocalDateTime.now() + "\"}";
        csaRegistrationService.addContactRecord(id, record);
        return R.ok();
    }

    @Operation(summary = "导出报名数据")
    @GetMapping("/export")
    public R<Void> export(@RequestParam(required = false) String targetType,
                           @RequestParam(required = false) String status) {
        // TODO: Implement Excel export
        return R.fail("导出功能暂未实现");
    }
}
